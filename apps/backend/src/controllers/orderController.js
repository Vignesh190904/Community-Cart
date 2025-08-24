const { supabase } = require('../config/supabaseClient');

// ========================================
// CUSTOMER ORDER OPERATIONS
// ========================================

// Create a new order (COD only)
const createOrder = async (req, res) => {
  try {
    const { vendor_id, items, delivery_address, delivery_instructions } = req.body;
    const customer_id = req.user.id;

    // Validate required fields
    if (!vendor_id || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vendor ID and items array are required'
      });
    }

    // Validate items structure
    for (const item of items) {
      if (!item.product_id || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have product_id and quantity > 0'
        });
      }
    }

    // Verify customer exists and get community_id
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .select('community_id')
      .eq('id', customer_id)
      .single();

    if (customerError || !customerData) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Verify vendor exists and belongs to same community
    const { data: vendorData, error: vendorError } = await supabase
      .from('vendors')
      .select('id, community_id')
      .eq('id', vendor_id)
      .eq('community_id', customerData.community_id)
      .single();

    if (vendorError || !vendorData) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vendor or vendor does not belong to your community'
      });
    }

    // Verify all products exist, are available, and have sufficient stock
    const productIds = items.map(item => item.product_id);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price, stock, available, vendor_id')
      .in('id', productIds);

    if (productsError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to verify products: ' + productsError.message
      });
    }

    // Validate products
    for (const item of items) {
      const product = products.find(p => p.id === item.product_id);
      
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product with ID ${item.product_id} not found`
        });
      }

      if (product.vendor_id !== vendor_id) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} does not belong to the selected vendor`
        });
      }

      if (!product.available) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is not available`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
        });
      }
    }

    // Calculate total amount
    let total_amount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = products.find(p => p.id === item.product_id);
      const itemTotal = product.price * item.quantity;
      total_amount += itemTotal;

      orderItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Create order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          customer_id,
          vendor_id,
          total_amount,
          payment_method: 'COD',
          status: 'pending',
          delivery_address: delivery_address || null,
          delivery_instructions: delivery_instructions || null
        }
      ])
      .select()
      .single();

    if (orderError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create order: ' + orderError.message
      });
    }

    // Create order items
    const orderItemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: orderData.id
    }));

    const { error: orderItemsError } = await supabase
      .from('order_items')
      .insert(orderItemsWithOrderId);

    if (orderItemsError) {
      // Clean up the order if order items creation fails
      await supabase.from('orders').delete().eq('id', orderData.id);
      
      return res.status(500).json({
        success: false,
        message: 'Failed to create order items: ' + orderItemsError.message
      });
    }

    // Get complete order with items
    const { data: completeOrder, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          quantity,
          price,
          products(name, image_url)
        ),
        vendors(shop_name),
        customers(name)
      `)
      .eq('id', orderData.id)
      .single();

    if (fetchError) {
      return res.status(500).json({
        success: false,
        message: 'Order created but failed to fetch details: ' + fetchError.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: completeOrder
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while creating order'
    });
  }
};

// Get customer order history
const getCustomerOrders = async (req, res) => {
  try {
    const customer_id = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    // Build query
    let query = supabase
      .from('orders')
      .select(`
        *,
        vendors(shop_name),
        order_items(
          quantity,
          price,
          products(name, image_url)
        )
      `)
      .eq('customer_id', customer_id)
      .order('created_at', { ascending: false });

    // Filter by status if provided
    if (status) {
      query = query.eq('status', status);
    }

    // Add pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: orders, error } = await query;

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch orders: ' + error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: orders.length
      }
    });

  } catch (error) {
    console.error('Get customer orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching orders'
    });
  }
};

// Get single order details
const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const customer_id = req.user.id;

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        vendors(shop_name, phone),
        customers(name, phone),
        order_items(
          quantity,
          price,
          products(name, description, image_url)
        )
      `)
      .eq('id', id)
      .eq('customer_id', customer_id)
      .single();

    if (error || !order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or you do not have permission to view it'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order details fetched successfully',
      order
    });

  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching order details'
    });
  }
};

// ========================================
// VENDOR ORDER OPERATIONS
// ========================================

// Get vendor's orders dashboard
const getVendorOrders = async (req, res) => {
  try {
    const vendor_id = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    // Build query
    let query = supabase
      .from('orders')
      .select(`
        *,
        customers(name, phone, block, flat),
        order_items(
          quantity,
          price,
          products(name, image_url)
        )
      `)
      .eq('vendor_id', vendor_id)
      .order('created_at', { ascending: false });

    // Filter by status if provided
    if (status) {
      query = query.eq('status', status);
    }

    // Add pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: orders, error } = await query;

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch orders: ' + error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: orders.length
      }
    });

  } catch (error) {
    console.error('Get vendor orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching orders'
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const vendor_id = req.user.id;

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required: ' + validStatuses.join(', ')
      });
    }

    // Check if order exists and belongs to vendor
    const { data: existingOrder, error: fetchError } = await supabase
      .from('orders')
      .select('status')
      .eq('id', id)
      .eq('vendor_id', vendor_id)
      .single();

    if (fetchError || !existingOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or you do not have permission to update it'
      });
    }

    // Prevent status changes for delivered or cancelled orders
    if (existingOrder.status === 'delivered' || existingOrder.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update status of delivered or cancelled orders'
      });
    }

    // Update order status
    const { data: orderData, error: updateError } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .eq('vendor_id', vendor_id)
      .select(`
        *,
        customers(name, phone),
        order_items(
          quantity,
          price,
          products(name)
        )
      `)
      .single();

    if (updateError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update order status: ' + updateError.message
      });
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status} successfully`,
      order: orderData
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while updating order status'
    });
  }
};

module.exports = {
  // Customer operations
  createOrder,
  getCustomerOrders,
  getOrderDetails,
  
  // Vendor operations
  getVendorOrders,
  updateOrderStatus
};
