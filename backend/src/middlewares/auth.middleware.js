import Customer from '../models/Customer.model.js';
import Vendor from '../models/Vendor.model.js';
import { verifyToken } from '../utils/jwt.utils.js';

// JWT-based authentication middleware
export const protect = async (req, res, next) => {
    try {
        let auth_token;

        // Extract token from Authorization header only
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            auth_token = req.headers.authorization.split(' ')[1];
        }

        // DEV-ONLY: Log auth header presence (not token value)
        if (process.env.NODE_ENV !== 'production') {
            console.log('[AUTH] Authorization header present:', !!req.headers.authorization);
        }

        if (!auth_token) {
            console.log('[AUTH] Unauthorized: No token found in header');
            return res.status(401).json({
                success: false,
                message: 'Not authenticated. No token provided.',
                error_code: 'NOT_AUTHENTICATED'
            });
        }

        // Verify token
        const decoded = verifyToken(auth_token);

        // Fetch customer from database
        const customer = await Customer.findById(decoded.id)
            .select('-auth.manual.password_hash');

        if (!customer) {
            console.log('[AUTH] Unauthorized: User not found in database for ID:', decoded.id);
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token failed',
                error_code: 'AUTH_ERROR'
            });
        }

        // Check if customer is active
        if (!customer.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Account is inactive',
                error_code: 'FORBIDDEN'
            });
        }

        // Attach customer to request object
        req.user = customer;
        next();
    } catch (error) {
        console.error('[AUTH] Auth Middleware Error:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Not authorized, token failed',
            error_code: 'AUTH_ERROR'
        });
    }
};

// Vendor protection middleware (demo mode - never blocks)
export const protectVendor = async (req, res, next) => {
    try {
        let auth_token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            auth_token = req.headers.authorization.split(' ')[1];
        }

        let decoded = null;
        if (auth_token) {
            try {
                decoded = verifyToken(auth_token);
            } catch (err) {
                decoded = null;
            }
        }

        if (decoded?.id) {
            try {
                // Debug log
                console.log('[protectVendor] Decoded ID:', decoded.id);
                const vendor = await Vendor.findById(decoded.id).select('-password');
                console.log('[protectVendor] Review Vendor found:', !!vendor);
                req.user = vendor || null;
                req.vendor = vendor || null;
            } catch (e) {
                console.error('[protectVendor] DB Error:', e.message);
                req.user = null;
                req.vendor = null;
            }
        } else {
            console.log('[protectVendor] No decoded ID');
            req.user = null;
            req.vendor = null;
        }

        req.userRole = decoded?.role || null;
        next();
    } catch (error) {
        req.user = null;
        req.vendor = null;
        req.userRole = null;
        next();
    }
};
