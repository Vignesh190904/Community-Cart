const express = require('express');
const {
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
} = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { 
  registerValidation, 
  loginValidation, 
  updateProfileValidation, 
  changePasswordValidation,
  adminCreateUserValidation 
} = require('../utils/validationRules');

const router = express.Router();

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfileValidation, updateProfile);
router.put('/change-password', protect, changePasswordValidation, changePassword);
router.post('/logout', protect, logout);

// Admin routes
router.get('/admin/users', protect, adminOnly, getAllUsers);
router.post('/admin/create-user', protect, adminOnly, adminCreateUserValidation, createUserByAdmin);
router.put('/admin/users/:id', protect, adminOnly, updateUserByAdmin);
router.delete('/admin/users/:id', protect, adminOnly, deleteUserByAdmin);

module.exports = router;
