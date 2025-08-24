/**
 * Vendor controller for the Community Cart application
 * Handles all vendor-specific operations including products, orders, analytics, and profile management
 */

const { supabase } = require('../config/supabaseClient');
const { AppError, errorCodes } = require('../middleware/errorHandler');
const { validateFile } = require('../middleware/validate');
const { ORDER_STATUSES, isValidStatusTransition } = require('../schemas/orderSchemas');

// ========================================
// PRODUCT OPERATIONS
// ========================================

/**
 * Create a new product
 */
const createProduct = async (req, res) => {
  const { name, description, price, stock, available, category_id, unit, image_url } = req.body;
  const vendor_id = req.vendor.id;
  const community_id = req.vendor.community_id;

  // Verify category belongs to the same community
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id')
    .eq('id', category_id)
    .eq('community_id', community_id)
    .single();

  if (categoryError || !category) {
    throw new AppError(
      'Invalid category or category does not belong to your community',
      errorCodes.CATEGORY_NOT_FOUND,
      400
    );
  }

  // Insert product
  const { data: product, error: productError } = await supabase
    .from('products')
    .insert([{
      vendor_id,
      category_id,
      name,
      description: description || null,
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      available: available !== undefined ? available : true,
      unit: unit || null,
      image_url: image_url || null
    }])
    .select(`*, categories(id, name), vendors(shop_name)`)
    .single();

  if (productError) {
    throw new AppError('Failed to create product', errorCodes.DATABASE_ERROR, 500);
  }

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product
  });
};

/**
 * Get vendor's products with filtering and pagination
 */
const getProducts = async (req, res) => {
  const vendor_id = req.vendor.id;
  const { 
    page = 1, limit = 10, sort = 'created_at', order = 'desc',
    search = '', category_id, available, low_stock
  } = req.query;

  let query = supabase
    .from('products')
    .select(`*, categories(id, name), vendors(shop_name)`, { count: 'exact' })
    .eq('vendor_id', vendor_id);

  if (search) query = query.ilike('name', `%${search}%`);
  if (category_id) query = query.eq('category_id', category_id);
  if (available !== undefined) query = query.eq('available', available === 'true');
  if (low_stock === 'true') query = query.lte('stock', 10);

  query = query.order(sort, { ascending: order === 'asc' });
  const offset = (page - 1) * limit;
  query = query.range(offset, offset + limit - 1);

  const { data: products, error, count } = await query;

  if (error) {
    throw new AppError('Failed to fetch products', errorCodes.DATABASE_ERROR, 500);
  }

  res.json({
    success: true,
    data: products,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      pages: Math.ceil(count / limit)
    }
  });
};

/**
 * Get a single product by ID
 */
const getProduct = async (req, res) => {
  const { id } = req.params;
  const vendor_id = req.vendor.id;

  const { data: product, error } = await supabase
    .from('products')
    .select(`*, categories(id, name), vendors(shop_name)`)
    .eq('id', id)
    .eq('vendor_id', vendor_id)
    .single();

  if (error || !product) {
    throw new AppError('Product not found', errorCodes.PRODUCT_NOT_FOUND, 404);
  }

  res.json({ success: true, data: product });
};

/**
 * Update product details
 */
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const vendor_id = req.vendor.id;
  const community_id = req.vendor.community_id;
  const updateData = req.body;

  // Check if product exists
  const { data: existingProduct, error: fetchError } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('vendor_id', vendor_id)
    .single();

  if (fetchError || !existingProduct) {
    throw new AppError('Product not found', errorCodes.PRODUCT_NOT_FOUND, 404);
  }

  // Verify category if being updated
  if (updateData.category_id) {
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', updateData.category_id)
      .eq('community_id', community_id)
      .single();

    if (categoryError || !category) {
      throw new AppError('Invalid category', errorCodes.CATEGORY_NOT_FOUND, 400);
    }
  }

  const { data: product, error: updateError } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', id)
    .eq('vendor_id', vendor_id)
    .select(`*, categories(id, name), vendors(shop_name)`)
    .single();

  if (updateError) {
    throw new AppError('Failed to update product', errorCodes.DATABASE_ERROR, 500);
  }

  res.json({
    success: true,
    message: 'Product updated successfully',
    data: product
  });
};

/**
 * Toggle product availability
 */
const toggleProductAvailability = async (req, res) => {
  const { id } = req.params;
  const { available } = req.body;
  const vendor_id = req.vendor.id;

  const { data: product, error } = await supabase
    .from('products')
    .update({ available })
    .eq('id', id)
    .eq('vendor_id', vendor_id)
    .select(`*, categories(id, name), vendors(shop_name)`)
    .single();

  if (error || !product) {
    throw new AppError('Product not found', errorCodes.PRODUCT_NOT_FOUND, 404);
  }

  res.json({
    success: true,
    message: `Product ${available ? 'made available' : 'made unavailable'} successfully`,
    data: product
  });
};

/**
 * Delete a product
 */
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const vendor_id = req.vendor.id;

  // Check if product has orders
  const { data: orderItems } = await supabase
    .from('order_items')
    .select('id')
    .eq('product_id', id)
    .limit(1);

  if (orderItems && orderItems.length > 0) {
    throw new AppError(
      'Cannot delete product with existing orders. Consider making it unavailable instead.',
      errorCodes.CONSTRAINT_VIOLATION,
      400
    );
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .eq('vendor_id', vendor_id);

  if (error) {
    throw new AppError('Failed to delete product', errorCodes.DATABASE_ERROR, 500);
  }

  res.json({ success: true, message: 'Product deleted successfully' });
};

/**
 * Bulk upload products
 */
const bulkUploadProducts = async (req, res) => {
  const { products, validate_only = false } = req.body;
  const vendor_id = req.vendor.id;
  const community_id = req.vendor.community_id;

  // Get categories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .eq('community_id', community_id);

  const categoryMap = new Map(categories.map(cat => [cat.id, cat.name]));
  const validationResults = [];
  const validProducts = [];

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const result = { row: i + 1, data: product, valid: true, errors: [] };

    if (!categoryMap.has(product.category_id)) {
      result.valid = false;
      result.errors.push({ field: 'category_id', message: 'Category does not exist' });
    }

    if (result.valid) {
      validProducts.push({
        ...product,
        vendor_id,
        price: parseFloat(product.price),
        stock: parseInt(product.stock) || 0,
        available: product.available !== undefined ? product.available : true
      });
    }

    validationResults.push(result);
  }

  if (validate_only) {
    return res.json({
      success: true,
      message: 'Validation completed',
      data: { total: products.length, valid: validProducts.length, results: validationResults }
    });
  }

  if (validProducts.length > 0) {
    const { data: insertedProducts, error } = await supabase
      .from('products')
      .insert(validProducts)
      .select(`*, categories(id, name), vendors(shop_name)`);

    if (error) {
      throw new AppError('Failed to insert products', errorCodes.DATABASE_ERROR, 500);
    }

    res.status(201).json({
      success: true,
      message: `Successfully uploaded ${insertedProducts.length} products`,
      data: { inserted: insertedProducts.length, products: insertedProducts }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'No valid products to upload',
      data: { valid: 0, results: validationResults }
    });
  }
};

/**
 * Upload product image
 */
const uploadProductImage = async (req, res) => {
  const { id } = req.params;
  const vendor_id = req.vendor.id;
  const file = req.file;

  validateFile(file);

  // Check product exists
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, name')
    .eq('id', id)
    .eq('vendor_id', vendor_id)
    .single();

  if (productError || !product) {
    throw new AppError('Product not found', errorCodes.PRODUCT_NOT_FOUND, 404);
  }

  // Generate filename and upload
  const fileExtension = file.originalname.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
  const filePath = `vendor_${vendor_id}/${id}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file.buffer, { contentType: file.mimetype });

  if (uploadError) {
    throw new AppError('Failed to upload image', errorCodes.FILE_UPLOAD_FAILED, 500);
  }

  // Get public URL and update product
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  const { data: updatedProduct, error: updateError } = await supabase
    .from('products')
    .update({ image_url: publicUrl })
    .eq('id', id)
    .eq('vendor_id', vendor_id)
    .select(`*, categories(id, name), vendors(shop_name)`)
    .single();

  if (updateError) {
    throw new AppError('Failed to update product with image URL', errorCodes.DATABASE_ERROR, 500);
  }

  res.json({
    success: true,
    message: 'Image uploaded successfully',
    data: { product: updatedProduct, image_url: publicUrl }
  });
};

// ========================================
// CATEGORY OPERATIONS
// ========================================

/**
 * Get all categories for vendor's community
 */
const getCategories = async (req, res) => {
  const community_id = req.vendor.community_id;

  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .eq('community_id', community_id)
    .order('name');

  if (error) {
    throw new AppError('Failed to fetch categories', errorCodes.DATABASE_ERROR, 500);
  }

  res.json({ success: true, data: categories });
};

// ========================================
// ORDER OPERATIONS
// ========================================

/**
 * Get vendor's orders
 */
const getVendorOrders = async (req, res) => {
  const vendor_id = req.vendor.id;
  const { page = 1, limit = 10, sort = 'created_at', order = 'desc', status, from, to } = req.query;

  let query = supabase
    .from('orders')
    .select(`*, customers(id, name), order_items(id, quantity, price, products(id, name, unit))`, { count: 'exact' })
    .eq('vendor_id', vendor_id);

  if (status) query = query.eq('status', status);
  if (from) query = query.gte('created_at', from);
  if (to) query = query.lte('created_at', to);

  query = query.order(sort, { ascending: order === 'asc' });
  const offset = (page - 1) * limit;
  query = query.range(offset, offset + limit - 1);

  const { data: orders, error, count } = await query;

  if (error) {
    throw new AppError('Failed to fetch orders', errorCodes.DATABASE_ERROR, 500);
  }

  res.json({
    success: true,
    data: orders,
    pagination: { page: parseInt(page), limit: parseInt(limit), total: count, pages: Math.ceil(count / limit) }
  });
};

/**
 * Get single order
 */
const getVendorOrder = async (req, res) => {
  const { id } = req.params;
  const vendor_id = req.vendor.id;

  const { data: order, error } = await supabase
    .from('orders')
    .select(`*, customers(id, name, phone), order_items(id, quantity, price, products(id, name, unit, image_url))`)
    .eq('id', id)
    .eq('vendor_id', vendor_id)
    .single();

  if (error || !order) {
    throw new AppError('Order not found', errorCodes.ORDER_NOT_FOUND, 404);
  }

  res.json({ success: true, data: order });
};

/**
 * Update order status
 */
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const vendor_id = req.vendor.id;

  // Get current order
  const { data: currentOrder, error: fetchError } = await supabase
    .from('orders')
    .select('status')
    .eq('id', id)
    .eq('vendor_id', vendor_id)
    .single();

  if (fetchError || !currentOrder) {
    throw new AppError('Order not found', errorCodes.ORDER_NOT_FOUND, 404);
  }

  // Validate transition
  if (!isValidStatusTransition(currentOrder.status, status)) {
    throw new AppError(
      `Invalid status transition from ${currentOrder.status} to ${status}`,
      errorCodes.INVALID_STATUS_TRANSITION,
      400
    );
  }

  // Update status
  const { data: order, error: updateError } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .eq('vendor_id', vendor_id)
    .select(`*, customers(id, name), order_items(id, quantity, price, products(id, name, unit))`)
    .single();

  if (updateError) {
    throw new AppError('Failed to update order status', errorCodes.DATABASE_ERROR, 500);
  }

  // Create history entry
  await supabase
    .from('order_status_history')
    .insert([{ order_id: id, status, notes: notes || null, changed_by_vendor_id: vendor_id }]);

  res.json({ success: true, message: 'Order status updated successfully', data: order });
};

/**
 * Get order timeline
 */
const getOrderTimeline = async (req, res) => {
  const { id } = req.params;
  const vendor_id = req.vendor.id;

  // Verify order belongs to vendor
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id')
    .eq('id', id)
    .eq('vendor_id', vendor_id)
    .single();

  if (orderError || !order) {
    throw new AppError('Order not found', errorCodes.ORDER_NOT_FOUND, 404);
  }

  const { data: timeline, error } = await supabase
    .from('order_status_history')
    .select(`*, vendors(name, shop_name)`)
    .eq('order_id', id)
    .order('created_at', { ascending: true });

  if (error) {
    throw new AppError('Failed to fetch order timeline', errorCodes.DATABASE_ERROR, 500);
  }

  res.json({ success: true, data: timeline });
};

// ========================================
// DASHBOARD & ANALYTICS
// ========================================

/**
 * Get dashboard summary
 */
const getDashboardSummary = async (req, res) => {
  const vendor_id = req.vendor.id;
  const { range = 'today' } = req.query;

  const now = new Date();
  let fromDate;

  switch (range) {
    case 'today':
      fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case '7d':
      fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  const [
    { data: products },
    { data: lowStockProducts },
    { data: pendingOrders },
    { data: revenueData }
  ] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact' }).eq('vendor_id', vendor_id),
    supabase.from('products').select('id', { count: 'exact' }).eq('vendor_id', vendor_id).lte('stock', 10),
    supabase.from('orders').select('id', { count: 'exact' }).eq('vendor_id', vendor_id).eq('status', 'pending'),
    supabase.from('orders').select('total_amount').eq('vendor_id', vendor_id)
      .gte('created_at', fromDate.toISOString()).in('status', ['completed'])
  ]);

  const totalRevenue = revenueData?.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) || 0;

  res.json({
    success: true,
    data: {
      total_products: products?.length || 0,
      low_stock_count: lowStockProducts?.length || 0,
      pending_orders: pendingOrders?.length || 0,
      revenue: { period: range, amount: totalRevenue }
    }
  });
};

/**
 * Get analytics data
 */
const getAnalytics = async (req, res) => {
  const vendor_id = req.vendor.id;
  const { range = '7d', from, to, metric = 'sales', group_by = 'day' } = req.query;

  let fromDate, toDate;
  const now = new Date();

  if (range === 'custom') {
    fromDate = new Date(from);
    toDate = new Date(to);
  } else {
    switch (range) {
      case 'today':
        fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        toDate = now;
        break;
      case '7d':
        fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        toDate = now;
        break;
      case '30d':
        fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        toDate = now;
        break;
      default:
        fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        toDate = now;
    }
  }

  const { data: orders, error } = await supabase
    .from('orders')
    .select(`created_at, total_amount, status, order_items(quantity, products(name))`)
    .eq('vendor_id', vendor_id)
    .gte('created_at', fromDate.toISOString())
    .lte('created_at', toDate.toISOString())
    .order('created_at');

  if (error) {
    throw new AppError('Failed to fetch analytics data', errorCodes.DATABASE_ERROR, 500);
  }

  res.json({
    success: true,
    data: { period: { from: fromDate, to: toDate }, metric, group_by, data: orders || [] }
  });
};

// ========================================
// PROFILE & SETTINGS
// ========================================

/**
 * Get vendor profile
 */
const getVendorProfile = async (req, res) => {
  const vendor_id = req.vendor.id;

  const { data: vendor, error } = await supabase
    .from('vendors')
    .select(`*, communities(id, name)`)
    .eq('id', vendor_id)
    .single();

  if (error || !vendor) {
    throw new AppError('Vendor profile not found', errorCodes.VENDOR_NOT_FOUND, 404);
  }

  res.json({ success: true, data: vendor });
};

/**
 * Update vendor profile
 */
const updateVendorProfile = async (req, res) => {
  const vendor_id = req.vendor.id;
  const updateData = req.body;

  const { data: vendor, error } = await supabase
    .from('vendors')
    .update(updateData)
    .eq('id', vendor_id)
    .select(`*, communities(id, name)`)
    .single();

  if (error) {
    throw new AppError('Failed to update vendor profile', errorCodes.DATABASE_ERROR, 500);
  }

  res.json({ success: true, message: 'Profile updated successfully', data: vendor });
};

/**
 * Get vendor settings
 */
const getVendorSettings = async (req, res) => {
  const vendor_id = req.vendor.id;

  const { data: settings, error } = await supabase
    .from('vendor_settings')
    .select('*')
    .eq('vendor_id', vendor_id)
    .single();

  const defaultSettings = {
    vendor_id,
    accept_orders: true,
    store_hours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '18:00', closed: false },
      sunday: { open: '09:00', close: '18:00', closed: true }
    },
    holidays: [],
    min_order_amount: 0,
    delivery_radius_km: 5,
    auto_accept_after_minutes: 0
  };

  res.json({ success: true, data: settings || defaultSettings });
};

/**
 * Update vendor settings
 */
const updateVendorSettings = async (req, res) => {
  const vendor_id = req.vendor.id;
  const updateData = { ...req.body, vendor_id };

  const { data: settings, error } = await supabase
    .from('vendor_settings')
    .upsert(updateData)
    .select()
    .single();

  if (error) {
    throw new AppError('Failed to update vendor settings', errorCodes.DATABASE_ERROR, 500);
  }

  res.json({ success: true, message: 'Settings updated successfully', data: settings });
};

/**
 * Health check
 */
const healthCheck = async (req, res) => {
  res.json({ success: true, message: 'Vendor API is healthy', timestamp: new Date().toISOString() });
};

module.exports = {
  // Product operations
  createProduct, getProducts, getProduct, updateProduct, toggleProductAvailability,
  deleteProduct, bulkUploadProducts, uploadProductImage,
  // Category operations
  getCategories,
  // Order operations
  getVendorOrders, getVendorOrder, updateOrderStatus, getOrderTimeline,
  // Dashboard & Analytics
  getDashboardSummary, getAnalytics,
  // Profile & Settings
  getVendorProfile, updateVendorProfile, getVendorSettings, updateVendorSettings,
  // Health check
  healthCheck
};
