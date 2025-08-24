const express = require('express');
const { supabase } = require('../config/supabaseClient');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// ========================================
// PUBLIC PRODUCT ROUTES
// ========================================

// GET /products - List products by community
router.get('/products', asyncHandler(async (req, res) => {
  const { community_id, category_id, vendor_id, search, page = 1, limit = 20 } = req.query;
  
  if (!community_id) {
    return res.status(400).json({
      success: false,
      message: 'community_id is required'
    });
  }

  let query = supabase
    .from('products')
    .select(`
      *,
      categories(id, name),
      vendors(id, name, shop_name),
      communities(id, name)
    `, { count: 'exact' })
    .eq('communities.id', community_id)
    .eq('available', true);

  if (category_id) {
    query = query.eq('category_id', category_id);
  }

  if (vendor_id) {
    query = query.eq('vendor_id', vendor_id);
  }

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  const offset = (page - 1) * limit;
  query = query.range(offset, offset + limit - 1);
  query = query.order('created_at', { ascending: false });

  const { data: products, error, count } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }

  res.json({
    success: true,
    data: {
      products: products || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    }
  });
}));

// GET /categories - List all categories for a community
router.get('/categories', asyncHandler(async (req, res) => {
  const { community_id } = req.query;
  
  if (!community_id) {
    return res.status(400).json({
      success: false,
      message: 'community_id is required'
    });
  }

  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .eq('community_id', community_id)
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }

  res.json({
    success: true,
    data: categories || []
  });
}));

// ========================================
// VENDOR PRODUCT ROUTES (Legacy - now handled by vendorRoutes.js)
// ========================================

// These routes are now handled by the vendor routes in vendorRoutes.js
// Keeping them here for backward compatibility but they should redirect

router.post('/vendor/products', (req, res) => {
  res.status(301).json({
    success: false,
    message: 'This endpoint has moved to /vendor/products. Please update your API calls.'
  });
});

router.put('/vendor/products/:id', (req, res) => {
  res.status(301).json({
    success: false,
    message: 'This endpoint has moved to /vendor/products/:id. Please update your API calls.'
  });
});

router.patch('/vendor/products/:id/toggle', (req, res) => {
  res.status(301).json({
    success: false,
    message: 'This endpoint has moved to /vendor/products/:id/toggle. Please update your API calls.'
  });
});

router.get('/vendor/products', (req, res) => {
  res.status(301).json({
    success: false,
    message: 'This endpoint has moved to /vendor/products. Please update your API calls.'
  });
});

module.exports = router;
