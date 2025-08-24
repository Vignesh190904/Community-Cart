/**
 * CORS configuration for Community Cart backend
 * Allows requests from frontend applications and admin portals
 */

const cors = require('cors');

// Get allowed origins from environment variables
const getAllowedOrigins = () => {
  const defaultOrigins = [
    'http://localhost:3000', // Admin portal (hardcoded)
    'http://localhost:5000', // Vendor portal (hardcoded)
    'http://localhost:4000', // Customer app (if applicable)
    'http://localhost:5173', // Vite development server
    'http://127.0.0.1:5173', // Vite development server (alternative)
  ];

  // Add production origins from environment
  const envOrigins = process.env.ALLOWED_ORIGINS;
  if (envOrigins) {
    const additionalOrigins = envOrigins.split(',').map(origin => origin.trim());
    return [...defaultOrigins, ...additionalOrigins];
  }

  return defaultOrigins;
};

/**
 * CORS configuration options
 */
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = getAllowedOrigins();
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and authorization headers
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-Requested-With',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Methods',
    'Access-Control-Allow-Headers'
  ],
  exposedHeaders: ['X-Total-Count'], // Expose pagination headers
  maxAge: 86400 // Cache preflight response for 24 hours
};

/**
 * Create CORS middleware with configuration
 */
const corsMiddleware = cors(corsOptions);

module.exports = {
  corsMiddleware,
  corsOptions,
  getAllowedOrigins
};
