const express = require('express');
const { supabase } = require('../config/supabaseClient');

const router = express.Router();

// POST /admin/signup - Register a new admin (no auth required)
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

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

    // Insert admin details into admins table
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .insert([
        {
          id: authData.user.id,
          name,
          phone: phone || null,
          email,
          password_hash: 'managed_by_supabase_auth' // Placeholder since we use Supabase Auth
        }
      ])
      .select()
      .single();

    if (adminError) {
      // If admin insertion fails, we should clean up the auth user
      // For now, we'll just return the error
      return res.status(500).json({
        success: false,
        message: 'Failed to create admin profile: ' + adminError.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: adminData.name,
        phone: adminData.phone
      }
    });

  } catch (error) {
    console.error('Admin signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during admin signup'
    });
  }
});

// POST /admin/login - Log in an admin (no auth required)
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

    // Get admin details from admins table
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (adminError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve admin profile'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: adminData.name,
        phone: adminData.phone
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during admin login'
    });
  }
});

module.exports = router;
