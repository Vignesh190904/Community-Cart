const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (payload, expiresIn = process.env.JWT_EXPIRE || '30d') => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn
  });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// Decode JWT token without verification (for debugging)
const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken
};
