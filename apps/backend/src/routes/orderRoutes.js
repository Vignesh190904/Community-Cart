const express = require('express');
const { supabase } = require('../config/supabaseClient');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// ========================================
// PUBLIC ORDER ROUTES
// ========================================

// GET /orders - List orders (requires authentication)
router.get('/orders', asyncHandler(async (req, res) => {
  // This endpoint requires authentication
  return res.status(401).json({
    success: false,
    message: 'No authentication token provided'
  });
}));

// ========================================
// VENDOR ORDER ROUTES (Legacy - now handled by vendorRoutes.js)
// ========================================

// These routes are now handled by the vendor routes in vendorRoutes.js
// Keeping them here for backward compatibility but they should redirect

router.get('/vendor/orders', (req, res) => {
  res.status(301).json({
    success: false,
    message: 'This endpoint has moved to /vendor/orders. Please update your API calls.'
  });
});

router.patch('/vendor/orders/:id/status', (req, res) => {
  res.status(301).json({
    success: false,
    message: 'This endpoint has moved to /vendor/orders/:id/status. Please update your API calls.'
  });
});

module.exports = router;
