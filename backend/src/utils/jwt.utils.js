import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_should_be_in_env';
const JWT_EXPIRES_IN = '7d';

/**
 * Sign a JWT token for a user
 * @param {string} userId - The user's ID
 * @returns {string} The signed token
 */
export const signToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, {
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
