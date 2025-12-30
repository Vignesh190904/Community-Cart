/**
 * Basic Usage Examples for Auth Module
 * 
 * This file demonstrates common use cases and patterns
 */

const express = require('express');
const auth = require('../index');

const app = express();
app.use(express.json());

// ============================================
// EXAMPLE 1: Basic Route Protection
// ============================================

// Any authenticated user can access
app.get('/api/profile', auth.protect, (req, res) => {
  res.json({
    message: 'Your profile',
    user: req.user // User object is available in req.user
  });
});

// ============================================
// EXAMPLE 2: Role-Based Access Control
// ============================================

// Admin only
app.get('/api/admin/dashboard', auth.protect, auth.adminOnly, (req, res) => {
  res.json({ message: 'Admin dashboard' });
});

// Admin or Manager
app.get('/api/reports', auth.protect, auth.managerAccess, (req, res) => {
  res.json({ message: 'Reports page' });
});

// Custom roles
app.get('/api/custom', auth.protect, auth.authorize('admin', 'staff', 'manager'), (req, res) => {
  res.json({ message: 'Custom access' });
});

// ============================================
// EXAMPLE 3: Using the User Model
// ============================================

const { UserModel } = auth;

// Create a user programmatically
async function createUser() {
  try {
    const user = await UserModel.create({
      userId: 'USR' + Date.now(),
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'securepassword',
      role: 'end-user',
      phone: '9876543210'
    });
    console.log('User created:', user);
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

// Find user by credentials
async function loginUser(email, password) {
  try {
    const user = await UserModel.findByCredentials(email, password);
    const token = auth.generateToken({ id: user._id, role: user.role });
    return { user, token };
  } catch (error) {
    console.error('Login failed:', error.message);
  }
}

// ============================================
// EXAMPLE 4: Custom Middleware
// ============================================

// Check if user owns the resource
const checkOwnership = async (req, res, next) => {
  try {
    const resourceUserId = req.params.userId;
    
    // Allow if user is admin or owns the resource
    if (req.user.role === 'admin' || req.user._id.toString() === resourceUserId) {
      return next();
    }
    
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to access this resource'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Use custom middleware
app.get('/api/users/:userId/data', auth.protect, checkOwnership, (req, res) => {
  res.json({ message: 'User data' });
});

// ============================================
// EXAMPLE 5: Token Generation and Verification
// ============================================

// Generate custom token
function generateCustomToken(userId, role) {
  return auth.generateToken(
    { id: userId, role: role },
    '7d' // Custom expiration
  );
}

// Verify token manually
function verifyCustomToken(token) {
  try {
    const decoded = auth.verifyToken(token);
    console.log('Token is valid:', decoded);
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return null;
  }
}

// ============================================
// EXAMPLE 6: Using Auth Routes
// ============================================

// Mount auth routes
app.use('/api/auth', auth.authRoutes);
app.use('/api/auth', auth.oauthRoutes);

// Now these endpoints are available:
// POST /api/auth/register
// POST /api/auth/login
// GET /api/auth/profile (protected)
// PUT /api/auth/profile (protected)
// PUT /api/auth/change-password (protected)
// POST /api/auth/logout (protected)
// GET /api/auth/admin/users (admin only)
// POST /api/auth/admin/create-user (admin only)
// PUT /api/auth/admin/users/:id (admin only)
// DELETE /api/auth/admin/users/:id (admin only)
// GET /api/auth/google (OAuth)
// GET /api/auth/google/callback (OAuth)

// ============================================
// EXAMPLE 7: Error Handling
// ============================================

app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Server error'
  });
});

// ============================================
// EXAMPLE 8: Custom User Queries
// ============================================

async function getUsersByRole(role) {
  return await UserModel.find({ role, isActive: true })
    .select('-password')
    .sort({ createdAt: -1 });
}

async function searchUsers(searchTerm) {
  return await UserModel.find({
    $or: [
      { name: { $regex: searchTerm, $options: 'i' } },
      { email: { $regex: searchTerm, $options: 'i' } }
    ],
    isActive: true
  }).select('-password');
}

// Export for use in other files
module.exports = {
  createUser,
  loginUser,
  generateCustomToken,
  verifyCustomToken,
  getUsersByRole,
  searchUsers
};
