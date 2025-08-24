const express = require('express');
const { supabase } = require('../config/supabaseClient');

const router = express.Router();

// POST /vendor/signup - Register a new vendor
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, shop_name, phone, community_id } = req.body;

    // Validate required fields
    if (!email || !password || !name || !shop_name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, name, and shop_name are required fields'
      });
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });

    if (authError) {
      return res.status(400).json({
        success: false,
        message: authError.message
      });
    }

    // Insert vendor details into vendors table
    const { data: vendorData, error: vendorError } = await supabase
      .from('vendors')
      .insert([
        {
          id: authData.user.id,
          name,
          shop_name,
          phone: phone || null,
          community_id: community_id || null
        }
      ])
      .select()
      .single();

    if (vendorError) {
      // If vendor insertion fails, we should clean up the auth user
      // For now, we'll just return the error
      return res.status(500).json({
        success: false,
        message: 'Failed to create vendor profile: ' + vendorError.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Vendor registered successfully',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: vendorData.name,
        shop_name: vendorData.shop_name,
        phone: vendorData.phone,
        community_id: vendorData.community_id
      }
    });

  } catch (error) {
    console.error('Vendor signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during vendor signup'
    });
  }
});

// POST /vendor/login - Log in a vendor
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Authenticate with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }

    // Get vendor details from vendors table
    const { data: vendorData, error: vendorError } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (vendorError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve vendor profile'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vendor login successful',
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: vendorData.name,
        shop_name: vendorData.shop_name,
        phone: vendorData.phone,
        community_id: vendorData.community_id
      }
    });

  } catch (error) {
    console.error('Vendor login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during vendor login'
    });
  }
});

module.exports = router;
