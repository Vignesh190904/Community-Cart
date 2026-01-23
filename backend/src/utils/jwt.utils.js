import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

/**
 * Sign a JWT token for a user
 * @param {object} user - The user object containing _id, role, etc.
 * @returns {string} The signed token
 */
export const signToken = (user) => {
    const payload = { id: user._id || user.id, role: user.role };
    if (user.tokenVersion !== undefined) payload.tokenVersion = user.tokenVersion;

    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    });
};

/**
 * Verify a JWT token
 * @param {string} token - The token to verify
 * @returns {object} The decoded payload
 * @throws {Error} If token is invalid or expired
 */
export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
