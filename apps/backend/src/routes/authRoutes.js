const express = require('express');
const { supabase } = require('../config/supabaseClient');

const router = express.Router();

// POST /auth/signup - Register a new customer
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, phone, block, flat, community_id } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and name are required fields'
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

    // Insert customer details into customers table
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .insert([
        {
          id: authData.user.id,
          name,
          phone: phone || null,
          block: block || null,
          flat: flat || null,
          community_id: community_id || null
        }
      ])
      .select()
      .single();

    if (customerError) {
      // If customer insertion fails, we should clean up the auth user
      // For now, we'll just return the error
      return res.status(500).json({
        success: false,
        message: 'Failed to create customer profile: ' + customerError.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Customer registered successfully',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: customerData.name,
        phone: customerData.phone,
        block: customerData.block,
        flat: customerData.flat,
        community_id: customerData.community_id
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during signup'
    });
  }
});

// POST /auth/login - Log in a customer
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

    // Get customer details from customers table
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (customerError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve customer profile'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: customerData.name,
        phone: customerData.phone,
        block: customerData.block,
        flat: customerData.flat,
        community_id: customerData.community_id
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
});

module.exports = router;
