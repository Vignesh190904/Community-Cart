import Customer from '../models/Customer.model.js';
import { verifyToken } from '../utils/jwt.utils.js';

// JWT-based authentication middleware
export const protect = async (req, res, next) => {
    try {
        let auth_token;

        // Check for Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            auth_token = req.headers.authorization.split(' ')[1];
        }
        // Check for cookie
        else if (req.cookies && req.cookies.auth_token) {
            auth_token = req.cookies.auth_token;
        }

        console.log('[AUTH] Raw Cookie Header:', req.headers.cookie);
        console.log('[AUTH] Parsed Cookies:', req.cookies);
        console.log('[AUTH] Token Found:', !!auth_token);
        if (auth_token) console.log('[AUTH] Token String (partial):', auth_token.substring(0, 10) + '...');

        if (!auth_token) {
            console.log('[AUTH] Unauthorized: No token found in header or cookies');
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
                message: 'User not found or invalid token',
                error_code: 'USER_NOT_FOUND'
            });
        }

        // Check if customer is active
        if (!customer.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Account is inactive',
                error_code: 'ACCOUNT_INACTIVE'
            });
        }

        // Attach customer to request object
        req.user = customer;
        next();
    } catch (error) {
        console.error('[AUTH] Auth Middleware Error:', error.message);
        console.error('[AUTH] Full Error:', error);
        return res.status(401).json({
            success: false,
            message: 'Not authorized, token failed',
            error_code: 'AUTH_ERROR'
        });
    }
};

// Optional: Middleware to check if user is NOT authenticated
export const guest = (req, res, next) => {
    // With JWT, checking guest state on backend is tricky without the token.
    // Usually purely frontend handled. But if token is passed, we can reject.
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        return res.status(400).json({
            success: false,
            message: 'Already authenticated',
            error_code: 'ALREADY_AUTHENTICATED'
        });
    }
    next();
};
