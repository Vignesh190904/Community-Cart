const { body } = require('express-validator');

// Validation rules for user registration
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone')
    .optional()
    .trim(),
  body('role')
    .optional()
    .isIn(['admin', 'vendor', 'customer'])
    .withMessage('Invalid role specified'),
  body('vendorId')
    .optional()
    .isMongoId()
    .withMessage('Invalid vendor reference')
];

// Validation rules for admin user creation
const adminCreateUserValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['admin', 'vendor', 'customer'])
    .withMessage('Invalid role specified'),
  body('phone')
    .optional()
    .trim(),
  body('vendorId')
    .optional()
    .isMongoId()
    .withMessage('Invalid vendor reference')
];

// Validation rules for login
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Validation rules for profile update
const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('phone')
    .optional()
    .trim(),
  body('vendorId')
    .optional()
    .isMongoId()
    .withMessage('Invalid vendor reference')
];

// Validation rules for password change
const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
];

module.exports = {
  registerValidation,
  adminCreateUserValidation,
  loginValidation,
  updateProfileValidation,
  changePasswordValidation
};
