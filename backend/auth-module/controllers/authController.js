const User = require('../models/User');
const { generateToken } = require('../utils/tokenUtils');
const { validationResult } = require('express-validator');

// Try to load notification utility, fallback if not available
let sendEmail;
try {
  sendEmail = require('../../../utils/notification').sendEmail;
} catch (error) {
  console.warn('Notification utility not found. Email notifications disabled.');
  sendEmail = async () => ({ success: false, error: 'Email service not configured' });
}

// Generate unique user ID
const generateUserId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `USR${timestamp}${random}`;
};

// @desc    Register new user (customer/vendor/admin)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, phone, role, vendorId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // For vendor accounts, vendorId should be provided so we can link to the vendor record
    if (role === 'vendor' && !vendorId) {
      return res.status(400).json({
        success: false,
        message: 'vendorId is required for vendor accounts'
      });
    }

    const userData = {
      userId: generateUserId(),
      name,
      email,
      password,
      phone,
      role: role || 'customer',
      vendorId: vendorId || null
    };

    const user = await User.create(userData);

    // Send welcome email (non-blocking)
    try {
      const emailSubject = 'Welcome to Community Cart!';
      const emailText = `Hello ${user.name},\n\nWelcome to Community Cart! Your account has been created successfully.\n\nRole: ${user.role}\n\nYou can now login and start managing your store.\n\nBest regards,\nCommunity Cart Team`;
      await sendEmail(user.email, emailSubject, emailText);
    } catch (emailError) {
      console.error('Email notification error:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful! You can now sign in.',
      data: {
        user: {
          id: user._id,
          userId: user.userId,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          vendorId: user.vendorId
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user by credentials (includes password verification)
    const user = await User.findByCredentials(email, password);

    // Generate JWT token
    const token = generateToken({
      id: user._id,
      role: user.role
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          userId: user.userId,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          vendorId: user.vendorId,
          lastLogin: user.lastLogin
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Invalid credentials'
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          userId: user.userId,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          vendorId: user.vendorId,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, phone, vendorId } = req.body;
    
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update allowed fields
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    
    if (vendorId && user.role === 'vendor') {
      user.vendorId = vendorId;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          userId: user.userId,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          vendorId: user.vendorId
        }
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error changing password'
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
};

// @desc    Get all users (Admin only)
// @route   GET /api/auth/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: {
        users,
        count: users.length
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching users'
    });
  }
};

// @desc    Create user by admin
// @route   POST /api/auth/admin/create-user
// @access  Private/Admin
const createUserByAdmin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, role, phone, vendorId } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Prepare user data
    const userData = {
      userId: generateUserId(),
      name,
      email,
      password,
      phone,
      role: role || 'customer',
      vendorId: vendorId || null,
      createdBy: req.user._id
    };

    const user = await User.create(userData);

    // Send welcome email
    try {
      const emailSubject = 'Account Created - Community Cart';
      const emailText = `Hello ${user.name},\n\nYour account has been created by an administrator.\n\nRole: ${user.role}\nEmail: ${user.email}\n\nPlease contact your administrator for login details.\n\nBest regards,\nCommunity Cart Team`;
      await sendEmail(user.email, emailSubject, emailText);
    } catch (emailError) {
      console.error('Email notification error:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          id: user._id,
          userId: user.userId,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          vendorId: user.vendorId,
          isActive: user.isActive
        }
      }
    });
  } catch (error) {
    console.error('Admin create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during user creation'
    });
  }
};

// @desc    Update user by admin
// @route   PUT /api/auth/admin/users/:id
// @access  Private/Admin
const updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, phone, vendorId, isActive } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check email uniqueness if changed
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: id } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (phone !== undefined) user.phone = phone;
    if (typeof isActive !== 'undefined') user.isActive = isActive;
    if (vendorId) user.vendorId = vendorId;

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        user: {
          id: user._id,
          userId: user.userId,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          vendorId: user.vendorId,
          isActive: user.isActive
        }
      }
    });
  } catch (error) {
    console.error('Admin update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating user'
    });
  }
};

// @desc    Delete user by admin
// @route   DELETE /api/auth/admin/users/:id
// @access  Private/Admin
const deleteUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent self-deletion
    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting user'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
  getAllUsers,
  createUserByAdmin,
  updateUserByAdmin,
  deleteUserByAdmin
};
