/**
 * Simple vendor routes without complex auth for basic functionality
 */

const express = require('express');
const { asyncHandler, AppError, errorCodes } = require('../middleware/errorHandler');

const router = express.Router();

// GET /vendor/products - Get vendor products (mock data for now)
router.get('/products', asyncHandler(async (req, res) => {
  // Mock product data
  const mockProducts = [
    {
      id: '1',
      name: 'Fresh Tomatoes',
      price: 40.00,
      stock: 50,
      available: true,
      category: 'Vegetables',
      unit: 'kg',
      created_at: new Date().toISOString()
    },
    {
      id: '2', 
      name: 'Organic Carrots',
      price: 60.00,
      stock: 30,
      available: true,
      category: 'Vegetables',
      unit: 'kg',
      created_at: new Date().toISOString()
    }
  ];

  res.json({
    success: true,
    data: mockProducts,
    pagination: {
      page: 1,
      limit: 10,
      total: mockProducts.length,
      totalPages: 1
    }
  });
}));

// POST /vendor/products - Create product (simplified)
router.post('/products', asyncHandler(async (req, res) => {
  const { name, price, stock, category, unit } = req.body;

  // Basic validation
  if (!name || !price) {
    return res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Name and price are required',
      fields: {
        ...((!name) && { name: 'Product name is required' }),
        ...((!price) && { price: 'Product price is required' })
      }
    });
  }

  // Mock successful creation
  const newProduct = {
    id: Date.now().toString(),
    name,
    price: parseFloat(price),
    stock: parseInt(stock) || 0,
    available: true,
    category: category || 'General',
    unit: unit || 'piece',
    created_at: new Date().toISOString()
  };

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: newProduct
  });
}));

// GET /vendor/orders - Get vendor orders (mock data)
router.get('/orders', asyncHandler(async (req, res) => {
  const mockOrders = [
    {
      id: '1',
      customer_name: 'John Doe',
      total_amount: 250.00,
      status: 'pending',
      items_count: 3,
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      customer_name: 'Jane Smith', 
      total_amount: 180.00,
      status: 'completed',
      items_count: 2,
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  res.json({
    success: true,
    data: mockOrders,
    pagination: {
      page: 1,
      limit: 10,
      total: mockOrders.length,
      totalPages: 1
    }
  });
}));

// PATCH /vendor/orders/:id/status - Update order status
router.patch('/orders/:id/status', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
  
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Invalid status',
      fields: { status: `Status must be one of: ${validStatuses.join(', ')}` }
    });
  }

  res.json({
    success: true,
    message: 'Order status updated successfully',
    data: { id, status, updated_at: new Date().toISOString() }
  });
}));

// GET /vendor/dashboard - Get dashboard data
router.get('/dashboard', asyncHandler(async (req, res) => {
  const dashboardData = {
    totalProducts: 25,
    activeProducts: 23,
    totalOrders: 156,
    pendingOrders: 8,
    completedOrders: 142,
    cancelledOrders: 6,
    totalRevenue: 45600.00,
    monthlyRevenue: 12400.00,
    averageOrderValue: 292.31,
    rating: 4.6,
    recentOrders: [
      { id: '1', customer: 'John Doe', amount: 250.00, status: 'pending' },
      { id: '2', customer: 'Jane Smith', amount: 180.00, status: 'completed' }
    ]
  };

  res.json({
    success: true,
    data: dashboardData
  });
}));

// GET /vendor/profile - Get vendor profile
router.get('/profile', asyncHandler(async (req, res) => {
  // For now, return mock profile data
  // In a real implementation, this would fetch from the database based on the authenticated user
  const mockProfile = {
    id: 'vendor-123',
    name: 'Sample Vendor',
    email: 'vendor@example.com',
    shop_name: 'Sample Shop',
    phone: '+1234567890',
    address: '123 Main St, City, State',
    community_id: 'community-123',
    rating: 4.5,
    total_orders: 156,
    total_revenue: 45600.00,
    created_at: new Date().toISOString()
  };

  res.json({
    success: true,
    data: mockProfile
  });
}));

// GET /vendor/health - Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Vendor routes are working',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
