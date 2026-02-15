import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error("FATAL: JWT_SECRET is missing in environment variables.");
    throw new Error("JWT_SECRET is missing");
}
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Sign a JWT token for a user
 * @param {object} user - The user object containing _id and role
 * @returns {string} The signed token
 */
export const signToken = (user) => {
    // Ensure we are getting a valid ID
    const userId = user._id || user.id;
    if (!userId) {
        console.error("signToken Error: User object missing _id or id", user);
        throw new Error("Cannot sign token: User ID missing");
    }

    const payload = {
        id: userId,
        role: user.role
    };

    // Preserve tokenVersion if exists (for invalidation)
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
