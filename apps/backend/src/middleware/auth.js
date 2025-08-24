const { supabase } = require('../config/supabaseClient');
const { AppError, errorCodes } = require('./errorHandler');

/**
 * Middleware to authenticate users using Supabase JWT tokens
 * Extracts and verifies the JWT token from Authorization header
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const verifySupabaseAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(
        'No authentication token provided',
        errorCodes.UNAUTHORIZED,
        401
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify the JWT token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new AppError(
        'Invalid or expired token',
        errorCodes.INVALID_TOKEN,
        401
      );
    }

    // Attach user to request object
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to attach user role information from database
 * Checks vendors, customers, and admin_users tables
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const attachUserRole = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let userRole = null;
    let roleData = null;

    // Check if user is a vendor
    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .select('id, community_id, shop_name, name')
      .eq('id', userId)
      .single();

    if (!vendorError && vendor) {
      userRole = 'vendor';
      roleData = vendor;
    } else {
      // Check if user is a customer
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('id, community_id, name')
        .eq('id', userId)
        .single();

      if (!customerError && customer) {
        userRole = 'customer';
        roleData = customer;
      } else {
        // Check if user is an admin
        const { data: admin, error: adminError } = await supabase
          .from('admins')
          .select('id, name, phone, email')
          .eq('id', userId)
          .single();

        if (!adminError && admin) {
          userRole = 'admin';
          roleData = admin;
        }
      }
    }

    if (!userRole) {
      throw new AppError(
        'User role not found. Please contact support.',
        errorCodes.FORBIDDEN,
        403
      );
    }

    // Attach role information to request
    req.userRole = userRole;
    req.roleData = roleData;
    
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to verify vendor role
 * Must be used after verifySupabaseAuth and attachUserRole middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requireVendor = (req, res, next) => {
  try {
    if (req.userRole !== 'vendor') {
      throw new AppError(
        'Access denied. Vendor role required.',
        errorCodes.FORBIDDEN,
        403
      );
    }

    // Attach vendor-specific data for convenience
    req.vendor = req.roleData;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to verify customer role
 * Must be used after verifySupabaseAuth and attachUserRole middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requireCustomer = (req, res, next) => {
  try {
    if (req.userRole !== 'customer') {
      throw new AppError(
        'Access denied. Customer role required.',
        errorCodes.FORBIDDEN,
        403
      );
    }

    // Attach customer-specific data for convenience
    req.customer = req.roleData;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to verify admin role
 * Must be used after verifySupabaseAuth and attachUserRole middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requireAdmin = (req, res, next) => {
  try {
    if (req.userRole !== 'admin') {
      throw new AppError(
        'Access denied. Admin role required.',
        errorCodes.FORBIDDEN,
        403
      );
    }

    // Attach admin-specific data for convenience
    req.admin = req.roleData;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to verify vendor ownership of a resource
 * Checks if the vendor_id in params or body matches the authenticated vendor
 * @param {string} paramName - Name of the parameter containing vendor_id (default: 'vendor_id')
 * @returns {Function} Express middleware function
 */
const requireVendorOwnership = (paramName = 'vendor_id') => {
  return (req, res, next) => {
    try {
      const resourceVendorId = req.params[paramName] || req.body[paramName];
      const authenticatedVendorId = req.vendor.id;

      if (resourceVendorId && resourceVendorId !== authenticatedVendorId) {
        throw new AppError(
          'Access denied. You can only access your own resources.',
          errorCodes.FORBIDDEN,
          403
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Legacy middleware for backward compatibility
const authenticateUser = verifySupabaseAuth;

module.exports = {
  // New enhanced middleware
  verifySupabaseAuth,
  attachUserRole,
  requireVendor,
  requireCustomer,
  requireAdmin,
  requireVendorOwnership,
  
  // Legacy middleware for backward compatibility
  authenticateUser
};
