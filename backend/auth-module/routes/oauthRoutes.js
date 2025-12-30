const express = require('express');
const passport = require('passport');
require('../config/passport');
const User = require('../models/User');
const { generateToken } = require('../utils/tokenUtils');

const router = express.Router();

// Google OAuth login route
router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(500).json({
      success: false,
      message: 'Google OAuth not configured on server'
    });
  }
  
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

// Google OAuth callback route
router.get('/google/callback', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_not_configured`);
  }
  
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=unauthorized` 
  })(req, res, next);
}, async (req, res) => {
    try {
      if (!req.user) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/not-authorized`);
      }

      const token = generateToken({ id: req.user._id });
      
      let redirectUrl;
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      
      switch (req.user.role.toLowerCase()) {
        case 'admin':
          redirectUrl = `${baseUrl}/admin/dashboard`;
          break;
        case 'vendor':
          redirectUrl = `${baseUrl}/vendor/dashboard`;
          break;
        default:
          redirectUrl = `${baseUrl}/dashboard`;
      }
      
      res.redirect(`${baseUrl}/oauth/success?token=${token}&redirect=${encodeURIComponent(redirectUrl)}&user=${encodeURIComponent(JSON.stringify({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        vendorId: req.user.vendorId
      }))}`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=server_error`);
    }
  }
);

// OAuth failure route
router.get('/google/failure', (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
});

module.exports = router;
