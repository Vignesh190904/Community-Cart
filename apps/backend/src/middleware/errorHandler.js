/**
 * Centralized error handler middleware for the Community Cart backend
 * Maps errors to standardized response format and appropriate HTTP status codes
 */

const errorCodes = {
  // Authentication & Authorization
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  
  // Validation
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // Resources
  PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND',
  ORDER_NOT_FOUND: 'ORDER_NOT_FOUND',
  VENDOR_NOT_FOUND: 'VENDOR_NOT_FOUND',
  CATEGORY_NOT_FOUND: 'CATEGORY_NOT_FOUND',
  
  // Business Logic
  ORDER_INVALID_STATUS: 'ORDER_INVALID_STATUS',
  INSUFFICIENT_STOCK: 'INSUFFICIENT_STOCK',
  INVALID_STATUS_TRANSITION: 'INVALID_STATUS_TRANSITION',
  
  // File Operations
  FILE_UPLOAD_FAILED: 'FILE_UPLOAD_FAILED',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  
  // Database
  DATABASE_ERROR: 'DATABASE_ERROR',
  CONSTRAINT_VIOLATION: 'CONSTRAINT_VIOLATION',
  
  // Generic
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  BAD_REQUEST: 'BAD_REQUEST'
};

/**
 * Custom error class for application-specific errors
 */
class AppError extends Error {
  constructor(message, code, statusCode = 500, details = null) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
  }
}

/**
 * Maps Supabase/PostgreSQL errors to application error codes
 * @param {Error} error - The original error
 * @returns {Object} - Mapped error with code and status
 */
const mapDatabaseError = (error) => {
  const message = error.message || 'Database operation failed';
  
  // PostgreSQL error codes
  if (error.code) {
    switch (error.code) {
      case '23505': // unique_violation
        return {
          code: errorCodes.CONSTRAINT_VIOLATION,
          message: 'Resource already exists',
          statusCode: 409
        };
      case '23503': // foreign_key_violation
        return {
          code: errorCodes.CONSTRAINT_VIOLATION,
          message: 'Referenced resource does not exist',
          statusCode: 400
        };
      case '23502': // not_null_violation
        return {
          code: errorCodes.MISSING_REQUIRED_FIELD,
          message: 'Required field is missing',
          statusCode: 400
        };
      default:
        return {
          code: errorCodes.DATABASE_ERROR,
          message: 'Database operation failed',
          statusCode: 500
        };
    }
  }
  
  // Supabase specific errors
  if (message.includes('JWT')) {
    return {
      code: errorCodes.INVALID_TOKEN,
      message: 'Invalid or expired token',
      statusCode: 401
    };
  }
  
  if (message.includes('not found') || message.includes('No rows')) {
    return {
      code: errorCodes.NOT_FOUND,
      message: 'Resource not found',
      statusCode: 404
    };
  }
  
  return {
    code: errorCodes.DATABASE_ERROR,
    message: 'Database operation failed',
    statusCode: 500
  };
};

/**
 * Central error handler middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    timestamp: new Date().toISOString()
  });

  let error = {
    success: false,
    message: 'Internal server error',
    code: errorCodes.INTERNAL_SERVER_ERROR,
    statusCode: 500
  };

  // Handle custom AppError
  if (err instanceof AppError) {
    error = {
      success: false,
      message: err.message,
      code: err.code,
      statusCode: err.statusCode,
      ...(err.details && { details: err.details })
    };
  }
  // Handle Joi validation errors
  else if (err.isJoi) {
    error = {
      success: false,
      message: 'Validation failed',
      code: errorCodes.VALIDATION_FAILED,
      statusCode: 400,
      details: err.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    };
  }
  // Handle database errors
  else if (err.code || (err.message && (err.message.includes('supabase') || err.message.includes('postgres')))) {
    const mappedError = mapDatabaseError(err);
    error = {
      success: false,
      message: mappedError.message,
      code: mappedError.code,
      statusCode: mappedError.statusCode
    };
  }
  // Handle multer file upload errors
  else if (err.code === 'LIMIT_FILE_SIZE') {
    error = {
      success: false,
      message: 'File too large',
      code: errorCodes.FILE_TOO_LARGE,
      statusCode: 413
    };
  }
  else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error = {
      success: false,
      message: 'Invalid file type or too many files',
      code: errorCodes.INVALID_FILE_TYPE,
      statusCode: 400
    };
  }
  // Handle other known errors
  else if (err.name === 'UnauthorizedError' || err.status === 401) {
    error = {
      success: false,
      message: 'Unauthorized access',
      code: errorCodes.UNAUTHORIZED,
      statusCode: 401
    };
  }
  else if (err.status === 403) {
    error = {
      success: false,
      message: 'Forbidden access',
      code: errorCodes.FORBIDDEN,
      statusCode: 403
    };
  }
  else if (err.status === 404) {
    error = {
      success: false,
      message: 'Resource not found',
      code: errorCodes.NOT_FOUND,
      statusCode: 404
    };
  }

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production' && error.statusCode === 500) {
    error.message = 'Internal server error';
    delete error.details;
  }

  res.status(error.statusCode).json(error);
};

/**
 * 404 handler for undefined routes
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    code: errorCodes.NOT_FOUND
  });
};

/**
 * Async wrapper to catch errors in async route handlers
 * @param {Function} fn - Async function to wrap
 * @returns {Function} - Wrapped function
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  AppError,
  errorCodes,
  errorHandler,
  notFoundHandler,
  asyncHandler
};
