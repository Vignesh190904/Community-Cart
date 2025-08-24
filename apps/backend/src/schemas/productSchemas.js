/**
 * Joi validation schemas for product-related operations
 * Used for validating request data in vendor product endpoints
 */

const Joi = require('joi');
const { commonSchemas } = require('../middleware/validate');

/**
 * Schema for creating a new product
 */
const createProductSchema = {
  body: Joi.object({
    name: Joi.string()
      .trim()
      .min(1)
      .max(255)
      .required()
      .messages({
        'string.empty': 'Product name is required',
        'string.max': 'Product name cannot exceed 255 characters'
      }),
    
    description: Joi.string()
      .trim()
      .max(2000)
      .allow('')
      .optional()
      .messages({
        'string.max': 'Description cannot exceed 2000 characters'
      }),
    
    price: Joi.number()
      .positive()
      .precision(2)
      .max(999999.99)
      .required()
      .messages({
        'number.positive': 'Price must be greater than 0',
        'number.max': 'Price cannot exceed 999,999.99'
      }),
    
    stock: Joi.number()
      .integer()
      .min(0)
      .max(999999)
      .default(0)
      .messages({
        'number.min': 'Stock cannot be negative',
        'number.max': 'Stock cannot exceed 999,999'
      }),
    
    available: Joi.boolean()
      .default(true),
    
    category_id: Joi.string()
      .uuid({ version: 'uuidv4' })
      .required()
      .messages({
        'string.guid': 'Category ID must be a valid UUID',
        'any.required': 'Category ID is required'
      }),
    
    unit: Joi.string()
      .trim()
      .max(50)
      .allow('')
      .optional()
      .messages({
        'string.max': 'Unit cannot exceed 50 characters'
      }),
    
    image_url: Joi.string()
      .uri()
      .allow('')
      .optional()
      .messages({
        'string.uri': 'Image URL must be a valid URL'
      })
  })
};

/**
 * Schema for updating an existing product
 */
const updateProductSchema = {
  params: Joi.object({
    id: commonSchemas.uuid
  }),
  
  body: Joi.object({
    name: Joi.string()
      .trim()
      .min(1)
      .max(255)
      .optional()
      .messages({
        'string.empty': 'Product name cannot be empty',
        'string.max': 'Product name cannot exceed 255 characters'
      }),
    
    description: Joi.string()
      .trim()
      .max(2000)
      .allow('')
      .optional()
      .messages({
        'string.max': 'Description cannot exceed 2000 characters'
      }),
    
    price: Joi.number()
      .positive()
      .precision(2)
      .max(999999.99)
      .optional()
      .messages({
        'number.positive': 'Price must be greater than 0',
        'number.max': 'Price cannot exceed 999,999.99'
      }),
    
    stock: Joi.number()
      .integer()
      .min(0)
      .max(999999)
      .optional()
      .messages({
        'number.min': 'Stock cannot be negative',
        'number.max': 'Stock cannot exceed 999,999'
      }),
    
    available: Joi.boolean()
      .optional(),
    
    category_id: Joi.string()
      .uuid({ version: 'uuidv4' })
      .optional()
      .messages({
        'string.guid': 'Category ID must be a valid UUID'
      }),
    
    unit: Joi.string()
      .trim()
      .max(50)
      .allow('')
      .optional()
      .messages({
        'string.max': 'Unit cannot exceed 50 characters'
      }),
    
    image_url: Joi.string()
      .uri()
      .allow('')
      .optional()
      .messages({
        'string.uri': 'Image URL must be a valid URL'
      })
  }).min(1) // At least one field must be provided
};

/**
 * Schema for toggling product availability
 */
const toggleAvailabilitySchema = {
  params: Joi.object({
    id: commonSchemas.uuid
  }),
  
  body: Joi.object({
    available: Joi.boolean()
      .required()
      .messages({
        'any.required': 'Available status is required'
      })
  })
};

/**
 * Schema for getting a single product
 */
const getProductSchema = {
  params: Joi.object({
    id: commonSchemas.uuid
  })
};

/**
 * Schema for listing products with filters
 */
const listProductsSchema = {
  query: Joi.object({
    // Pagination
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    
    // Sorting
    sort: Joi.string()
      .valid('name', 'price', 'stock', 'created_at', 'updated_at')
      .default('created_at'),
    order: Joi.string()
      .valid('asc', 'desc')
      .default('desc'),
    
    // Filtering
    search: Joi.string()
      .trim()
      .max(255)
      .allow('')
      .optional(),
    
    category_id: Joi.string()
      .uuid({ version: 'uuidv4' })
      .optional(),
    
    available: Joi.boolean()
      .optional(),
    
    low_stock: Joi.boolean()
      .optional()
      .description('Filter products with stock below threshold')
  })
};

/**
 * Schema for bulk product upload
 */
const bulkUploadSchema = {
  body: Joi.object({
    products: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().trim().min(1).max(255).required(),
          description: Joi.string().trim().max(2000).allow('').optional(),
          price: Joi.number().positive().precision(2).max(999999.99).required(),
          stock: Joi.number().integer().min(0).max(999999).default(0),
          available: Joi.boolean().default(true),
          category_id: Joi.string().uuid({ version: 'uuidv4' }).required(),
          unit: Joi.string().trim().max(50).allow('').optional(),
          image_url: Joi.string().uri().allow('').optional()
        })
      )
      .min(1)
      .max(1000)
      .required()
      .messages({
        'array.min': 'At least one product is required',
        'array.max': 'Cannot upload more than 1000 products at once'
      }),
    
    validate_only: Joi.boolean()
      .default(false)
      .description('If true, only validate data without inserting')
  })
};

/**
 * Schema for deleting a product
 */
const deleteProductSchema = {
  params: Joi.object({
    id: commonSchemas.uuid
  })
};

/**
 * Schema for uploading product image
 */
const uploadImageSchema = {
  params: Joi.object({
    id: commonSchemas.uuid
  })
};

/**
 * Schema for CSV bulk upload row validation
 */
const csvRowSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required(),
  description: Joi.string().trim().max(2000).allow('').default(''),
  price: Joi.number().positive().precision(2).max(999999.99).required(),
  stock: Joi.number().integer().min(0).max(999999).default(0),
  available: Joi.boolean().default(true),
  category_name: Joi.string().trim().min(1).max(255).required(),
  unit: Joi.string().trim().max(50).allow('').default(''),
  image_url: Joi.string().uri().allow('').default('')
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  toggleAvailabilitySchema,
  getProductSchema,
  listProductsSchema,
  bulkUploadSchema,
  deleteProductSchema,
  uploadImageSchema,
  csvRowSchema
};
