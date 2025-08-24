const { supabase } = require('../config/supabaseClient');

// ========================================
// VENDOR PRODUCT OPERATIONS
// ========================================

// Add a new product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category_id, image_url, available } = req.body;
    const vendor_id = req.user.id; // From auth middleware

    console.log('Add product request body:', req.body);

    // Validate required fields
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name and price are required fields'
      });
    }

    // Validate price
    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be greater than 0'
      });
    }

    // Validate stock
    if (stock !== undefined && stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock cannot be negative'
      });
    }

    // Verify vendor exists and get community_id
    const { data: vendorData, error: vendorError } = await supabase
      .from('vendors')
      .select('community_id')
      .eq('id', vendor_id)
      .single();

    if (vendorError || !vendorData) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    // Handle category_id - if not provided or invalid, use default category
    let finalCategoryId = category_id;
    
    if (category_id) {
      // Verify category belongs to the same community
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('id', category_id)
        .eq('community_id', vendorData.community_id)
        .single();

      if (categoryError || !categoryData) {
        console.log('Category not found, using default');
        // Get or create a default category
        const { data: defaultCategory } = await supabase
          .from('categories')
          .select('id')
          .eq('community_id', vendorData.community_id)
          .eq('name', 'General')
          .single();
        
        if (defaultCategory) {
          finalCategoryId = defaultCategory.id;
        } else {
          // Create default category
          const { data: newCategory } = await supabase
            .from('categories')
            .insert([{ community_id: vendorData.community_id, name: 'General' }])
            .select('id')
            .single();
          
          finalCategoryId = newCategory?.id || 'general';
        }
      }
    } else {
      // No category provided, get or create default
      const { data: defaultCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('community_id', vendorData.community_id)
        .eq('name', 'General')
        .single();
      
      if (defaultCategory) {
        finalCategoryId = defaultCategory.id;
      } else {
        // Create default category
        const { data: newCategory } = await supabase
          .from('categories')
          .insert([{ community_id: vendorData.community_id, name: 'General' }])
          .select('id')
          .single();
        
        finalCategoryId = newCategory?.id || 'general';
      }
    }

    // Insert product
    const { data: productData, error: productError } = await supabase
      .from('products')
      .insert([
        {
          vendor_id,
          category_id: finalCategoryId,
          name,
          description: description || null,
          price: parseFloat(price),
          stock: parseInt(stock) || 0,
          available: available !== undefined ? available : true,
          image_url: image_url || null
        }
      ])
      .select()
      .single();

    if (productError) {
      console.error('Product insert error:', productError);
      return res.status(500).json({
        success: false,
        message: 'Failed to create product: ' + productError.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: productData
    });

  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while creating product'
    });
  }
};

// Update product details
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category_id, image_url } = req.body;
    const vendor_id = req.user.id;

    // Validate required fields
    if (!name || !price || !category_id) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, and category_id are required fields'
      });
    }

    // Check if product exists and belongs to vendor
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('vendor_id', vendor_id)
      .single();

    if (fetchError || !existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or you do not have permission to update it'
      });
    }

    // Verify category belongs to the same community
    const { data: vendorData } = await supabase
      .from('vendors')
      .select('community_id')
      .eq('id', vendor_id)
      .single();

    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', category_id)
      .eq('community_id', vendorData.community_id)
      .single();

    if (categoryError || !categoryData) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category or category does not belong to your community'
      });
    }

    // Update product
    const { data: productData, error: updateError } = await supabase
      .from('products')
      .update({
        name,
        description: description || null,
        price,
        stock: stock !== undefined ? stock : existingProduct.stock,
        category_id,
        image_url: image_url || null
      })
      .eq('id', id)
      .eq('vendor_id', vendor_id)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update product: ' + updateError.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: productData
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while updating product'
    });
  }
};

// Toggle product availability
const toggleProductAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor_id = req.user.id;

    // Check if product exists and belongs to vendor
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('available')
      .eq('id', id)
      .eq('vendor_id', vendor_id)
      .single();

    if (fetchError || !existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or you do not have permission to update it'
      });
    }

    // Toggle availability
    const { data: productData, error: updateError } = await supabase
      .from('products')
      .update({ available: !existingProduct.available })
      .eq('id', id)
      .eq('vendor_id', vendor_id)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to toggle product availability: ' + updateError.message
      });
    }

    res.status(200).json({
      success: true,
      message: `Product ${productData.available ? 'made available' : 'made unavailable'} successfully`,
      product: productData
    });

  } catch (error) {
    console.error('Toggle product availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while toggling product availability'
    });
  }
};

// List vendor's products
const getVendorProducts = async (req, res) => {
  try {
    const vendor_id = req.user.id;
    const { page = 1, limit = 10, available } = req.query;

    // Build query
    let query = supabase
      .from('products')
      .select(`
        *,
        categories(name),
        vendors(shop_name)
      `)
      .eq('vendor_id', vendor_id);

    // Filter by availability if provided
    if (available !== undefined) {
      query = query.eq('available', available === 'true');
    }

    // Add pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: products, error, count } = await query;

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch products: ' + error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || products.length
      }
    });

  } catch (error) {
    console.error('Get vendor products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching products'
    });
  }
};

// ========================================
// CUSTOMER PRODUCT OPERATIONS
// ========================================

// List products by category or vendor
const getProducts = async (req, res) => {
  try {
    const { category_id, vendor_id, community_id, page = 1, limit = 10, search } = req.query;

    // Validate community_id is provided
    if (!community_id) {
      return res.status(400).json({
        success: false,
        message: 'community_id is required'
      });
    }

    // Build query
    let query = supabase
      .from('products')
      .select(`
        *,
        categories(name),
        vendors(shop_name, name)
      `)
      .eq('available', true)
      .eq('stock', 0, 'gt'); // Only products with stock > 0

    // Filter by community through vendors
    query = query.eq('vendors.community_id', community_id);

    // Apply filters
    if (category_id) {
      query = query.eq('category_id', category_id);
    }

    if (vendor_id) {
      query = query.eq('vendor_id', vendor_id);
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // Add pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: products, error } = await query;

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch products: ' + error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: products.length
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching products'
    });
  }
};

// Get categories for a community
const getCategories = async (req, res) => {
  try {
    const { community_id } = req.query;

    if (!community_id) {
      return res.status(400).json({
        success: false,
        message: 'community_id is required'
      });
    }

    // First try to get existing categories
    let { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .eq('community_id', community_id)
      .order('name');

    if (error) {
      console.error('Categories fetch error:', error);
      // Return default categories if database query fails
      return res.status(200).json({
        success: true,
        message: 'Default categories returned',
        categories: [
          { id: 'groceries', name: 'Groceries' },
          { id: 'electronics', name: 'Electronics' },
          { id: 'clothing', name: 'Clothing' },
          { id: 'general', name: 'General' }
        ]
      });
    }

    // If no categories found, create default ones
    if (!categories || categories.length === 0) {
      const defaultCategories = [
        { community_id, name: 'Groceries' },
        { community_id, name: 'Electronics' },
        { community_id, name: 'Clothing' },
        { community_id, name: 'General' }
      ];

      const { data: newCategories, error: insertError } = await supabase
        .from('categories')
        .insert(defaultCategories)
        .select();

      if (insertError) {
        console.error('Categories insert error:', insertError);
        // Return default categories if insert fails
        return res.status(200).json({
          success: true,
          message: 'Default categories returned',
          categories: [
            { id: 'groceries', name: 'Groceries' },
            { id: 'electronics', name: 'Electronics' },
            { id: 'clothing', name: 'Clothing' },
            { id: 'general', name: 'General' }
          ]
        });
      }

      categories = newCategories;
    }

    res.status(200).json({
      success: true,
      message: 'Categories fetched successfully',
      categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    // Return default categories as fallback
    res.status(200).json({
      success: true,
      message: 'Default categories returned',
      categories: [
        { id: 'groceries', name: 'Groceries' },
        { id: 'electronics', name: 'Electronics' },
        { id: 'clothing', name: 'Clothing' },
        { id: 'general', name: 'General' }
      ]
    });
  }
};

module.exports = {
  // Vendor operations
  addProduct,
  updateProduct,
  toggleProductAvailability,
  getVendorProducts,
  
  // Customer operations
  getProducts,
  getCategories
};
