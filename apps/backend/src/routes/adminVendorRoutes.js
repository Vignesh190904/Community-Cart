const express = require('express');
const Joi = require('joi');
const { supabase } = require('../config/supabaseClient');
const { asyncHandler, AppError, errorCodes } = require('../middleware/errorHandler');
const { verifySupabaseAuth, attachUserRole, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const createVendorSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 100 characters',
    'any.required': 'Name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  }),
  phone: Joi.string().min(8).max(15).required().messages({
    'string.min': 'Phone number must be at least 8 characters',
    'string.max': 'Phone number cannot exceed 15 characters',
    'any.required': 'Phone number is required'
  }),
  shop_name: Joi.string().max(100).optional().allow('', null),
  business_name: Joi.string().max(100).optional().allow('', null),
  category: Joi.string().valid('vegetables', 'grocery', 'bakery', 'food', 'general').optional(),
  description: Joi.string().max(500).optional().allow('', null),
  community_name: Joi.string().max(100).optional().allow('', null)
});

const updateVendorSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional().messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 100 characters'
  }),
  email: Joi.string().email().optional().messages({
    'string.email': 'Please provide a valid email address'
  }),
  phone: Joi.string().min(8).max(15).optional().messages({
    'string.min': 'Phone number must be at least 8 characters',
    'string.max': 'Phone number cannot exceed 15 characters'
  }),
  shop_name: Joi.string().max(100).optional().allow('', null),
  business_name: Joi.string().max(100).optional().allow('', null),
  category: Joi.string().valid('vegetables', 'grocery', 'bakery', 'food', 'general').optional(),
  description: Joi.string().max(500).optional().allow('', null),
  status: Joi.boolean().optional()
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin routes are working',
    timestamp: new Date().toISOString()
  });
});

// Apply authentication middleware
router.use('/vendors', verifySupabaseAuth, attachUserRole, requireAdmin);
router.use('/dashboard', verifySupabaseAuth, attachUserRole, requireAdmin);

// GET /admin/vendors - Get all vendors with search
router.get('/vendors', asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  let query = supabase
    .from('vendors')
    .select(`
      id,
      name,
      email,
      shop_name,
      phone,
      business_name,
      category,
      description,
      rating,
      total_orders,
      total_revenue,
      status,
      created_at,
      communities(name)
    `);

  if (q) {
    query = query.or(`name.ilike.%${q}%,shop_name.ilike.%${q}%,email.ilike.%${q}%`);
  }

  const { data: vendors, error } = await query.order('created_at', { ascending: false });

  if (error) {
    throw new AppError('Failed to fetch vendors: ' + error.message, errorCodes.DATABASE_ERROR, 500);
  }

  const formattedVendors = vendors.map(vendor => ({
    id: vendor.id,
    name: vendor.name,
    email: vendor.email || 'N/A',
    shop_name: vendor.shop_name,
    phone: vendor.phone,
    business_name: vendor.business_name,
    category: vendor.category || 'general',
    description: vendor.description,
    rating: vendor.rating || 0,
    total_orders: vendor.total_orders || 0,
    total_revenue: vendor.total_revenue || 0,
    status: vendor.status !== false,
    community_name: vendor.communities?.name || 'Unknown',
    created_at: vendor.created_at
  }));

  res.status(200).json({
    success: true,
    vendors: formattedVendors
  });
}));

// GET /admin/vendors/:id - Get single vendor
router.get('/vendors/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: vendor, error } = await supabase
    .from('vendors')
    .select(`
      id,
      name,
      email,
      shop_name,
      phone,
      business_name,
      category,
      description,
      rating,
      total_orders,
      total_revenue,
      status,
      created_at,
      communities(name)
    `)
    .eq('id', id)
    .single();

  if (error || !vendor) {
    throw new AppError('Vendor not found', errorCodes.NOT_FOUND, 404);
  }

  const formattedVendor = {
    id: vendor.id,
    name: vendor.name,
    email: vendor.email || 'N/A',
    shop_name: vendor.shop_name,
    phone: vendor.phone,
    business_name: vendor.business_name,
    category: vendor.category || 'general',
    description: vendor.description,
    rating: vendor.rating || 0,
    total_orders: vendor.total_orders || 0,
    total_revenue: vendor.total_revenue || 0,
    status: vendor.status !== false,
    community_name: vendor.communities?.name || 'Unknown',
    created_at: vendor.created_at
  };

  res.status(200).json({
    success: true,
    data: formattedVendor
  });
}));

// POST /admin/vendors/create - Create new vendor
router.post('/vendors/create', asyncHandler(async (req, res) => {
  console.log('🔍 Create vendor request:', JSON.stringify(req.body, null, 2));

  // Validate request body
  const { error: validationError, value } = createVendorSchema.validate(req.body, { abortEarly: false });
  
  if (validationError) {
    console.log('❌ Validation errors:', validationError.details);
    const fields = {};
    validationError.details.forEach(detail => {
      fields[detail.path[0]] = detail.message;
    });
    
    return res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Validation failed',
      fields
    });
  }

  const { name, email, password, phone, shop_name, business_name, category, description, community_name } = value;

  console.log('✅ Validation passed, processing vendor creation...');
  console.log('📝 Validated data:', { name, email, phone, shop_name, business_name, category, description });

  // Check if name already exists in vendors table
  const { data: existingVendor, error: vendorCheckError } = await supabase
    .from('vendors')
    .select('id')
    .eq('name', name)
    .single();

  if (!vendorCheckError && existingVendor) {
    return res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Vendor name already exists',
      fields: { name: 'This vendor name is already registered' }
    });
  }

  // Check if email already exists in auth
  const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
  
  if (!listError && existingUsers.users) {
    const emailExists = existingUsers.users.some(user => user.email === email);
    if (emailExists) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Email already exists',
        fields: { email: 'This email is already registered' }
      });
    }
  }

  // Get or create community
  let communityId;
  const communityName = community_name || 'Default Community';
  
  const { data: existingCommunity, error: communityError } = await supabase
    .from('communities')
    .select('id')
    .eq('name', communityName)
    .single();

  if (communityError && communityError.code === 'PGRST116') {
    // Community doesn't exist, create it
    const { data: newCommunity, error: createCommunityError } = await supabase
      .from('communities')
      .insert([{ 
        name: communityName, 
        address: 'Address to be updated',
        description: 'Default community for new vendors'
      }])
      .select('id')
      .single();

    if (createCommunityError) {
      throw new AppError('Failed to create community: ' + createCommunityError.message, errorCodes.DATABASE_ERROR, 500);
    }
    communityId = newCommunity.id;
  } else if (communityError) {
    throw new AppError('Error checking community: ' + communityError.message, errorCodes.DATABASE_ERROR, 500);
  } else {
    communityId = existingCommunity.id;
  }

  // Create user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name,
      role: 'vendor',
      shop_name: shop_name || business_name || name + "'s Shop"
    }
  });

  if (authError) {
    throw new AppError('Failed to create vendor user: ' + authError.message, errorCodes.BAD_REQUEST, 400);
  }

  // Create vendor record - explicitly exclude password_hash since we use Supabase Auth
  const vendorData = {
    id: authData.user.id,
    community_id: communityId,
    name: name,
    email: email, // Explicitly include email
    shop_name: shop_name || null,
    phone: phone,
    business_name: business_name || null,
    category: category || 'general',
    description: description || null
    // Note: password_hash is intentionally excluded - Supabase Auth handles passwords
  };

  console.log('📝 Inserting vendor data:', vendorData);

  const { data: vendor, error: vendorError } = await supabase
    .from('vendors')
    .insert([vendorData])
    .select(`
      id,
      name,
      email,
      shop_name,
      phone,
      business_name,
      category,
      description,
      created_at,
      communities(name)
    `)
    .single();

  if (vendorError) {
    console.error('❌ Vendor insertion error:', vendorError);
    // Clean up auth user if vendor creation fails
    await supabase.auth.admin.deleteUser(authData.user.id);
    throw new AppError('Failed to create vendor profile: ' + vendorError.message, errorCodes.DATABASE_ERROR, 500);
  }

  const responseData = {
    id: vendor.id,
    name: vendor.name,
    email: vendor.email,
    shop_name: vendor.shop_name,
    phone: vendor.phone,
    business_name: vendor.business_name,
    category: vendor.category,
    description: vendor.description,
    community_name: vendor.communities?.name || 'Unknown',
    status: true,
    created_at: vendor.created_at,
    // Include login credentials for admin reference
    login_credentials: {
      email: email,
      password: password, // Return the password for admin to share with vendor
      note: 'Share these credentials with the vendor for login access'
    }
  };

  console.log('✅ Vendor created successfully:', {
    ...responseData,
    login_credentials: { email: email, password: '***HIDDEN***' }
  });

  res.status(201).json({
    success: true,
    message: 'Vendor created successfully',
    vendor: responseData
  });
}));

// PUT /admin/vendors/:id - Update vendor
router.put('/vendors/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  console.log('🔍 Update vendor request:', { id, body: JSON.stringify(req.body, null, 2) });

  // Validate request body
  const { error: validationError, value } = updateVendorSchema.validate(req.body, { abortEarly: false });
  
  if (validationError) {
    console.log('❌ Update validation errors:', validationError.details);
    const fields = {};
    validationError.details.forEach(detail => {
      fields[detail.path[0]] = detail.message;
    });
    
    return res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Validation failed',
      fields
    });
  }

  const { name, email, phone, shop_name, business_name, category, description, status } = value;

  // Check if vendor exists
  const { data: existingVendor, error: checkError } = await supabase
    .from('vendors')
    .select('id, email, name')
    .eq('id', id)
    .single();

  if (checkError || !existingVendor) {
    throw new AppError('Vendor not found', errorCodes.NOT_FOUND, 404);
  }

  // Check name uniqueness if name is being updated
  if (name && name !== existingVendor.name) {
    const { data: nameExists, error: nameCheckError } = await supabase
      .from('vendors')
      .select('id')
      .eq('name', name)
      .neq('id', id)
      .single();

    if (!nameCheckError && nameExists) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Vendor name already exists',
        fields: { name: 'This vendor name is already registered' }
      });
    }
  }

  // Check email uniqueness if email is being updated
  if (email && email !== existingVendor.email) {
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (!listError && existingUsers.users) {
      const emailExists = existingUsers.users.some(user => 
        user.email === email && user.id !== id
      );
      
      if (emailExists) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Email already exists',
          fields: { email: 'This email is already registered by another user' }
        });
      }
    }
  }

  // Prepare update data - handle empty strings properly
  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email;
  if (shop_name !== undefined) updateData.shop_name = shop_name || null;
  if (phone !== undefined) updateData.phone = phone;
  if (business_name !== undefined) updateData.business_name = business_name || null;
  if (category !== undefined) updateData.category = category;
  if (description !== undefined) updateData.description = description || null;
  if (status !== undefined) updateData.status = status;

  // Update vendor in database
  const { data: vendor, error: vendorError } = await supabase
    .from('vendors')
    .update(updateData)
    .eq('id', id)
    .select(`
      id,
      name,
      email,
      shop_name,
      phone,
      business_name,
      category,
      description,
      rating,
      total_orders,
      total_revenue,
      status,
      created_at,
      communities(name)
    `)
    .single();

  if (vendorError) {
    throw new AppError('Failed to update vendor: ' + vendorError.message, errorCodes.DATABASE_ERROR, 500);
  }

  // Update email in Auth if provided
  if (email && email !== existingVendor.email) {
    const { error: authUpdateError } = await supabase.auth.admin.updateUserById(id, {
      email: email,
      email_confirm: true
    });

    if (authUpdateError) {
      console.error('⚠️ Failed to update email in auth:', authUpdateError);
    }
  }

  const formattedVendor = {
    id: vendor.id,
    name: vendor.name,
    email: vendor.email || 'N/A',
    shop_name: vendor.shop_name,
    phone: vendor.phone,
    business_name: vendor.business_name,
    category: vendor.category || 'general',
    description: vendor.description,
    rating: vendor.rating || 0,
    total_orders: vendor.total_orders || 0,
    total_revenue: vendor.total_revenue || 0,
    status: vendor.status !== false,
    community_name: vendor.communities?.name || 'Unknown',
    created_at: vendor.created_at
  };

  console.log('✅ Vendor updated successfully:', formattedVendor);

  res.status(200).json({
    success: true,
    message: 'Vendor updated successfully',
    data: formattedVendor
  });
}));

// DELETE /admin/vendors/:id - Delete vendor
router.delete('/vendors/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if vendor exists
  const { data: vendor, error: checkError } = await supabase
    .from('vendors')
    .select('id')
    .eq('id', id)
    .single();

  if (checkError || !vendor) {
    throw new AppError('Vendor not found', errorCodes.NOT_FOUND, 404);
  }

  // Delete vendor from database
  const { error: deleteError } = await supabase
    .from('vendors')
    .delete()
    .eq('id', id);

  if (deleteError) {
    throw new AppError('Failed to delete vendor: ' + deleteError.message, errorCodes.DATABASE_ERROR, 500);
  }

  // Delete user from Auth
  const { error: authDeleteError } = await supabase.auth.admin.deleteUser(id);
  
  if (authDeleteError) {
    console.error('⚠️ Failed to delete user from auth:', authDeleteError);
  }

  res.status(200).json({
    success: true,
    message: 'Vendor deleted successfully'
  });
}));

// Dashboard stats endpoint
router.get('/dashboard/stats', asyncHandler(async (req, res) => {
  // Get basic stats
  const { data: vendors, error: vendorsError } = await supabase
    .from('vendors')
    .select('id, status');

  if (vendorsError) {
    throw new AppError('Failed to fetch vendor stats: ' + vendorsError.message, errorCodes.DATABASE_ERROR, 500);
  }

  const totalVendors = vendors.length;
  const activeVendors = vendors.filter(v => v.status !== false).length;

  res.status(200).json({
    success: true,
    data: {
      totalVendors,
      activeVendors,
      inactiveVendors: totalVendors - activeVendors
    }
  });
}));

module.exports = router;
