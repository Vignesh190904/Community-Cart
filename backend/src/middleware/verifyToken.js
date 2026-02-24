import { verifyToken as jwtVerify } from '../utils/jwt.utils.js';

/**
 * Express middleware – verifies the JWT from Authorization: Bearer <token>
 * and attaches the decoded payload to req.user.
 * Used as a default export so route files can import it as: import verifyToken from '...'
 */
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token missing' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwtVerify(token);

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export default verifyToken;
