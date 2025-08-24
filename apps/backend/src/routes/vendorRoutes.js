/**
 * Vendor routes for the Community Cart application
 * Handles all vendor-specific operations including products, orders, analytics, and profile management
 */

const express = require('express');
const multer = require('multer');
const { 
  verifySupabaseAuth, 
  attachUserRole, 
  requireVendor 
} = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { asyncHandler } = require('../middleware/errorHandler');

// Import validation schemas
const {
  createProductSchema,
  updateProductSchema,
  toggleAvailabilitySchema,
  getProductSchema,
  listProductsSchema,
  bulkUploadSchema,
  deleteProductSchema,
  uploadImageSchema
} = require('../schemas/productSchemas');

const {
  updateStatusSchema,
  getOrderSchema,
  listOrdersSchema,
  getOrderTimelineSchema,
  orderAnalyticsSchema
} = require('../schemas/orderSchemas');

const {
  updateProfileSchema,
  settingsSchema,
  dashboardSummarySchema,
  analyticsSchema
} = require('../schemas/vendorSchemas');

// Import controllers
const {
  // Product operations
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  toggleProductAvailability,
  deleteProduct,
  bulkUploadProducts,
  uploadProductImage,
  
  // Category operations
  getCategories,
  
  // Order operations
  getVendorOrders,
  getVendorOrder,
  updateOrderStatus,
  getOrderTimeline,
  
  // Dashboard & Analytics
  getDashboardSummary,
  getAnalytics,
  
  // Profile & Settings
  getVendorProfile,
  updateVendorProfile,
  getVendorSettings,
  updateVendorSettings,
  
  // Health check
  healthCheck
} = require('../controllers/vendorController');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.'), false);
    }
  }
});

// Apply authentication and role verification to all vendor routes
router.use(verifySupabaseAuth);
router.use(attachUserRole);
router.use(requireVendor);

// ========================================
// PRODUCT ROUTES
// ========================================

/**
 * @route   POST /vendor/products
 * @desc    Create a new product
 * @access  Private (Vendor only)
 */
router.post('/products', 
  validate(createProductSchema),
  asyncHandler(createProduct)
);

/**
 * @route   GET /vendor/products
 * @desc    List vendor's products with filtering and pagination
 * @access  Private (Vendor only)
 */
router.get('/products',
  validate(listProductsSchema),
  asyncHandler(getProducts)
);

/**
 * @route   GET /vendor/products/:id
 * @desc    Get a single product by ID
 * @access  Private (Vendor only)
 */
router.get('/products/:id',
  validate(getProductSchema),
  asyncHandler(getProduct)
);

/**
 * @route   PUT /vendor/products/:id
 * @desc    Update product details
 * @access  Private (Vendor only)
 */
router.put('/products/:id',
  validate(updateProductSchema),
  asyncHandler(updateProduct)
);

/**
 * @route   PATCH /vendor/products/:id/toggle
 * @desc    Toggle product availability
 * @access  Private (Vendor only)
 */
router.patch('/products/:id/toggle',
  validate(toggleAvailabilitySchema),
  asyncHandler(toggleProductAvailability)
);

/**
 * @route   DELETE /vendor/products/:id
 * @desc    Delete a product
 * @access  Private (Vendor only)
 */
router.delete('/products/:id',
  validate(deleteProductSchema),
  asyncHandler(deleteProduct)
);

/**
 * @route   POST /vendor/products/bulk-upload
 * @desc    Bulk upload products via JSON array
 * @access  Private (Vendor only)
 */
router.post('/products/bulk-upload',
  validate(bulkUploadSchema),
  asyncHandler(bulkUploadProducts)
);

/**
 * @route   POST /vendor/products/:id/image
 * @desc    Upload product image
 * @access  Private (Vendor only)
 */
router.post('/products/:id/image',
  validate(uploadImageSchema),
  upload.single('image'),
  asyncHandler(uploadProductImage)
);

// ========================================
// CATEGORY ROUTES
// ========================================

/**
 * @route   GET /vendor/categories
 * @desc    Get all categories for vendor's community
 * @access  Private (Vendor only)
 */
router.get('/categories',
  asyncHandler(getCategories)
);

// ========================================
// ORDER ROUTES
// ========================================

/**
 * @route   GET /vendor/orders
 * @desc    List vendor's orders with filtering and pagination
 * @access  Private (Vendor only)
 */
router.get('/orders',
  validate(listOrdersSchema),
  asyncHandler(getVendorOrders)
);

/**
 * @route   GET /vendor/orders/:id
 * @desc    Get a single order by ID
 * @access  Private (Vendor only)
 */
router.get('/orders/:id',
  validate(getOrderSchema),
  asyncHandler(getVendorOrder)
);

/**
 * @route   PATCH /vendor/orders/:id/status
 * @desc    Update order status
 * @access  Private (Vendor only)
 */
router.patch('/orders/:id/status',
  validate(updateStatusSchema),
  asyncHandler(updateOrderStatus)
);

/**
 * @route   GET /vendor/orders/:id/timeline
 * @desc    Get order status timeline/history
 * @access  Private (Vendor only)
 */
router.get('/orders/:id/timeline',
  validate(getOrderTimelineSchema),
  asyncHandler(getOrderTimeline)
);

// ========================================
// DASHBOARD & ANALYTICS ROUTES
// ========================================

/**
 * @route   GET /vendor/dashboard/summary
 * @desc    Get dashboard summary data
 * @access  Private (Vendor only)
 */
router.get('/dashboard/summary',
  validate(dashboardSummarySchema),
  asyncHandler(getDashboardSummary)
);

/**
 * @route   GET /vendor/dashboard
 * @desc    Get dashboard data (alias for /dashboard/summary)
 * @access  Private (Vendor only)
 */
router.get('/dashboard',
  validate(dashboardSummarySchema),
  asyncHandler(getDashboardSummary)
);

/**
 * @route   GET /vendor/analytics/sales
 * @desc    Get sales analytics data
 * @access  Private (Vendor only)
 */
router.get('/analytics/sales',
  validate(analyticsSchema),
  asyncHandler(getAnalytics)
);

// ========================================
// PROFILE & SETTINGS ROUTES
// ========================================

/**
 * @route   GET /vendor/me
 * @desc    Get vendor profile
 * @access  Private (Vendor only)
 */
router.get('/me',
  asyncHandler(getVendorProfile)
);

/**
 * @route   GET /vendor/profile
 * @desc    Get vendor profile (alias for /me)
 * @access  Private (Vendor only)
 */
router.get('/profile',
  asyncHandler(getVendorProfile)
);

/**
 * @route   PUT /vendor/me
 * @desc    Update vendor profile
 * @access  Private (Vendor only)
 */
router.put('/me',
  validate(updateProfileSchema),
  asyncHandler(updateVendorProfile)
);

/**
 * @route   PUT /vendor/profile
 * @desc    Update vendor profile (alias for /me)
 * @access  Private (Vendor only)
 */
router.put('/profile',
  validate(updateProfileSchema),
  asyncHandler(updateVendorProfile)
);

/**
 * @route   GET /vendor/settings
 * @desc    Get vendor settings
 * @access  Private (Vendor only)
 */
router.get('/settings',
  asyncHandler(getVendorSettings)
);

/**
 * @route   PUT /vendor/settings
 * @desc    Update vendor settings
 * @access  Private (Vendor only)
 */
router.put('/settings',
  validate(settingsSchema),
  asyncHandler(updateVendorSettings)
);

// ========================================
// HEALTH CHECK
// ========================================

/**
 * @route   GET /vendor/health
 * @desc    Health check endpoint
 * @access  Private (Vendor only)
 */
router.get('/health',
  asyncHandler(healthCheck)
);

module.exports = router;
