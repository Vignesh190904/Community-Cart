/**
 * Joi validation schemas for vendor-related operations
 * Used for validating request data in vendor profile and settings endpoints
 */

const Joi = require('joi');
const { commonSchemas } = require('../middleware/validate');

/**
 * Schema for updating vendor profile
 */
const updateProfileSchema = {
  body: Joi.object({
    name: Joi.string()
      .trim()
      .min(1)
      .max(255)
      .optional()
      .messages({
        'string.empty': 'Name cannot be empty',
        'string.max': 'Name cannot exceed 255 characters'
      }),
    
    shop_name: Joi.string()
      .trim()
      .min(1)
      .max(255)
      .optional()
      .messages({
        'string.empty': 'Shop name cannot be empty',
        'string.max': 'Shop name cannot exceed 255 characters'
      }),
    
    phone: Joi.string()
      .trim()
      .pattern(/^[\+]?[1-9][\d]{0,15}$/)
      .optional()
      .messages({
        'string.pattern.base': 'Phone number must be a valid format'
      }),
    
    address: Joi.string()
      .trim()
      .max(500)
      .allow('')
      .optional()
      .messages({
        'string.max': 'Address cannot exceed 500 characters'
      }),
    
    description: Joi.string()
      .trim()
      .max(1000)
      .allow('')
      .optional()
      .messages({
        'string.max': 'Description cannot exceed 1000 characters'
      })
  }).min(1) // At least one field must be provided
};

/**
 * Schema for vendor settings
 */
const settingsSchema = {
  body: Joi.object({
    accept_orders: Joi.boolean()
      .optional()
      .description('Whether vendor is accepting new orders'),
    
    store_hours: Joi.object({
      monday: Joi.object({
        open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(''),
        close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(''),
        closed: Joi.boolean().default(false)
      }).optional(),
      tuesday: Joi.object({
        open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(''),
        close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(''),
        closed: Joi.boolean().default(false)
      }).optional(),
      wednesday: Joi.object({
        open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(''),
        close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(''),
        closed: Joi.boolean().default(false)
      }).optional(),
      thursday: Joi.object({
        open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(''),
        close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(''),
        closed: Joi.boolean().default(false)
      }).optional(),
      friday: Joi.object({
        open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(''),
        close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(''),
        closed: Joi.boolean().default(false)
      }).optional(),
      saturday: Joi.object({
        open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(''),
        close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(''),
        closed: Joi.boolean().default(false)
      }).optional(),
      sunday: Joi.object({
        open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(''),
        close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).allow(''),
        closed: Joi.boolean().default(false)
      }).optional()
    })
    .optional()
    .description('Store operating hours for each day of the week'),
    
    holidays: Joi.array()
      .items(Joi.date().iso())
      .optional()
      .description('Array of holiday dates when store is closed'),
    
    min_order_amount: Joi.number()
      .min(0)
      .precision(2)
      .max(9999.99)
      .optional()
      .messages({
        'number.min': 'Minimum order amount cannot be negative',
        'number.max': 'Minimum order amount cannot exceed 9,999.99'
      }),
    
    delivery_radius_km: Joi.number()
      .integer()
      .min(0)
      .max(100)
      .optional()
      .messages({
        'number.min': 'Delivery radius cannot be negative',
        'number.max': 'Delivery radius cannot exceed 100 km'
      }),
    
    auto_accept_after_minutes: Joi.number()
      .integer()
      .min(0)
      .max(1440) // 24 hours
      .optional()
      .description('Auto-accept orders after specified minutes (0 = disabled)')
      .messages({
        'number.min': 'Auto-accept time cannot be negative',
        'number.max': 'Auto-accept time cannot exceed 24 hours (1440 minutes)'
      }),
    
    notification_preferences: Joi.object({
      email_orders: Joi.boolean().default(true),
      sms_orders: Joi.boolean().default(false),
      push_orders: Joi.boolean().default(true),
      email_reviews: Joi.boolean().default(true),
      email_promotions: Joi.boolean().default(false)
    }).optional()
  }).min(1) // At least one field must be provided
};

/**
 * Schema for vendor dashboard summary request
 */
const dashboardSummarySchema = {
  query: Joi.object({
    range: Joi.string()
      .valid('today', '7d', '30d')
      .default('today')
      .description('Time range for summary data')
  })
};

/**
 * Schema for vendor analytics request
 */
const analyticsSchema = {
  query: Joi.object({
    range: Joi.string()
      .valid('today', '7d', '30d', '90d', 'custom')
      .default('7d'),
    
    from: Joi.date()
      .iso()
      .when('range', {
        is: 'custom',
        then: Joi.required(),
        otherwise: Joi.optional()
      }),
    
    to: Joi.date()
      .iso()
      .min(Joi.ref('from'))
      .when('range', {
        is: 'custom',
        then: Joi.required(),
        otherwise: Joi.optional()
      }),
    
    metric: Joi.string()
      .valid('sales', 'orders', 'customers', 'products')
      .default('sales'),
    
    group_by: Joi.string()
      .valid('hour', 'day', 'week', 'month')
      .default('day')
  })
};

/**
 * Schema for vendor registration/signup
 */
const vendorSignupSchema = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    
    password: Joi.string()
      .min(8)
      .max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.max': 'Password cannot exceed 128 characters',
        'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, and one number',
        'any.required': 'Password is required'
      }),
    
    name: Joi.string()
      .trim()
      .min(1)
      .max(255)
      .required()
      .messages({
        'string.empty': 'Name is required',
        'string.max': 'Name cannot exceed 255 characters'
      }),
    
    shop_name: Joi.string()
      .trim()
      .min(1)
      .max(255)
      .required()
      .messages({
        'string.empty': 'Shop name is required',
        'string.max': 'Shop name cannot exceed 255 characters'
      }),
    
    phone: Joi.string()
      .trim()
      .pattern(/^[\+]?[1-9][\d]{0,15}$/)
      .required()
      .messages({
        'string.pattern.base': 'Phone number must be a valid format',
        'any.required': 'Phone number is required'
      }),
    
    community_id: commonSchemas.uuid,
    
    address: Joi.string()
      .trim()
      .max(500)
      .allow('')
      .optional()
  })
};

/**
 * Schema for vendor login
 */
const vendorLoginSchema = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required'
      })
  })
};

/**
 * Schema for password reset request
 */
const passwordResetSchema = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      })
  })
};

/**
 * Schema for password update
 */
const updatePasswordSchema = {
  body: Joi.object({
    current_password: Joi.string()
      .required()
      .messages({
        'any.required': 'Current password is required'
      }),
    
    new_password: Joi.string()
      .min(8)
      .max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        'string.min': 'New password must be at least 8 characters long',
        'string.max': 'New password cannot exceed 128 characters',
        'string.pattern.base': 'New password must contain at least one lowercase letter, one uppercase letter, and one number',
        'any.required': 'New password is required'
      }),
    
    confirm_password: Joi.string()
      .valid(Joi.ref('new_password'))
      .required()
      .messages({
        'any.only': 'Password confirmation does not match new password',
        'any.required': 'Password confirmation is required'
      })
  })
};

module.exports = {
  updateProfileSchema,
  settingsSchema,
  dashboardSummarySchema,
  analyticsSchema,
  vendorSignupSchema,
  vendorLoginSchema,
  passwordResetSchema,
  updatePasswordSchema
};
