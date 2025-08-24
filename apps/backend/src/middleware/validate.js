/**
 * Validation middleware using Joi schemas
 * Provides reusable validation for request body, params, and query parameters
 */

const Joi = require('joi');
const { AppError, errorCodes } = require('./errorHandler');

/**
 * Creates validation middleware for Joi schemas
 * @param {Object} schemas - Object containing joi schemas for body, params, query
 * @param {Joi.Schema} schemas.body - Schema for request body
 * @param {Joi.Schema} schemas.params - Schema for request params
 * @param {Joi.Schema} schemas.query - Schema for request query
 * @returns {Function} Express middleware function
 */
const validate = (schemas) => {
  return (req, res, next) => {
    const errors = [];

    // Validate request body
    if (schemas.body && Object.keys(req.body).length > 0) {
      const { error } = schemas.body.validate(req.body, { abortEarly: false });
      if (error) {
        errors.push(...error.details.map(detail => ({
          field: `body.${detail.path.join('.')}`,
          message: detail.message,
          value: detail.context?.value
        })));
      }
    }

    // Validate request params
    if (schemas.params) {
      const { error } = schemas.params.validate(req.params, { abortEarly: false });
      if (error) {
        errors.push(...error.details.map(detail => ({
          field: `params.${detail.path.join('.')}`,
          message: detail.message,
          value: detail.context?.value
        })));
      }
    }

    // Validate request query
    if (schemas.query) {
      const { error } = schemas.query.validate(req.query, { abortEarly: false });
      if (error) {
        errors.push(...error.details.map(detail => ({
          field: `query.${detail.path.join('.')}`,
          message: detail.message,
          value: detail.context?.value
        })));
      }
    }

    if (errors.length > 0) {
      throw new AppError(
        'Validation failed',
        errorCodes.VALIDATION_FAILED,
        400,
        errors
      );
    }

    next();
  };
};

/**
 * Validates single field with custom Joi schema
 * @param {any} value - Value to validate
 * @param {Joi.Schema} schema - Joi schema
 * @param {string} fieldName - Name of the field for error reporting
 * @returns {any} Validated value
 * @throws {AppError} If validation fails
 */
const validateField = (value, schema, fieldName = 'field') => {
  const { error, value: validatedValue } = schema.validate(value);
  
  if (error) {
    throw new AppError(
      `Invalid ${fieldName}: ${error.details[0].message}`,
      errorCodes.VALIDATION_FAILED,
      400,
      [{
        field: fieldName,
        message: error.details[0].message,
        value
      }]
    );
  }
  
  return validatedValue;
};

/**
 * Common validation schemas for reuse
 */
const commonSchemas = {
  // UUID validation
  uuid: Joi.string().uuid({ version: 'uuidv4' }).required(),
  
  // Pagination
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().valid('name', 'price', 'created_at', 'updated_at').default('created_at'),
    order: Joi.string().valid('asc', 'desc').default('desc')
  }),
  
  // Search
  search: Joi.object({
    search: Joi.string().trim().max(255).allow(''),
    category_id: Joi.string().uuid().optional(),
    status: Joi.string().optional()
  }),
  
  // Date range
  dateRange: Joi.object({
    from: Joi.date().iso().optional(),
    to: Joi.date().iso().min(Joi.ref('from')).optional()
  }),
  
  // File upload
  file: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().valid(
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif'
    ).required(),
    size: Joi.number().max(5 * 1024 * 1024), // 5MB max
    buffer: Joi.binary().required()
  })
};

/**
 * Validates file upload
 * @param {Object} file - Multer file object
 * @returns {Object} Validated file
 * @throws {AppError} If validation fails
 */
const validateFile = (file) => {
  if (!file) {
    throw new AppError(
      'No file provided',
      errorCodes.MISSING_REQUIRED_FIELD,
      400
    );
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.mimetype)) {
    throw new AppError(
      'Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed',
      errorCodes.INVALID_FILE_TYPE,
      400
    );
  }

  // Check file size (5MB max)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new AppError(
      'File too large. Maximum size is 5MB',
      errorCodes.FILE_TOO_LARGE,
      413
    );
  }

  return file;
};

/**
 * Validates CSV data for bulk upload
 * @param {Array} data - Array of objects from CSV
 * @param {Joi.Schema} rowSchema - Schema for each row
 * @returns {Array} Validated data with errors
 */
const validateCSVData = (data, rowSchema) => {
  const results = [];
  
  data.forEach((row, index) => {
    const { error, value } = rowSchema.validate(row, { abortEarly: false });
    
    results.push({
      row: index + 1,
      data: value,
      valid: !error,
      errors: error ? error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      })) : []
    });
  });
  
  return results;
};

module.exports = {
  validate,
  validateField,
  validateFile,
  validateCSVData,
  commonSchemas
};
