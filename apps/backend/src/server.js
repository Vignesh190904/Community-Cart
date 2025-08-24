const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import configurations
const { corsMiddleware } = require('./config/cors');
const { helmetMiddleware } = require('./config/helmet');

// Import middleware
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = 8000; // Hardcoded to port 8000

// ========================================
// SECURITY & LOGGING MIDDLEWARE
// ========================================

// Security headers
app.use(helmetMiddleware);

// CORS configuration
app.use(corsMiddleware);

// Request logging with enhanced details
const customMorganFormat = process.env.NODE_ENV === 'production' 
  ? 'combined' 
  : ':method :url :status :res[content-length] - :response-time ms :body';

// Custom token for request body (non-GET requests only)
morgan.token('body', (req) => {
  if (req.method !== 'GET' && req.body && Object.keys(req.body).length > 0) {
    return `Body: ${JSON.stringify(req.body)}`;
  }
  return '';
});

app.use(morgan(customMorganFormat));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all requests
app.use(limiter);

// Stricter rate limiting for sensitive endpoints
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests to sensitive endpoint, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  }
});

// ========================================
// BODY PARSING MIDDLEWARE
// ========================================

// Parse JSON bodies (limit to 2MB as specified)
app.use(express.json({ limit: '2mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ========================================
// ROUTES
// ========================================

// Import routes
const adminVendorRoutes = require('./routes/adminVendorRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const vendorAuthRoutes = require('./routes/vendorAuthRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const simpleVendorRoutes = require('./routes/simpleVendorRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Health check endpoint (no auth required)
app.get('/health', (req, res) => {
  res.json({ 
    success: true,
    message: 'Community Cart API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API health check with more details
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Community Cart API is healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  });
});

// Mount routes
app.use('/auth/admin', strictLimiter, adminAuthRoutes); // Mount auth routes at different path
app.use('/admin', strictLimiter, adminVendorRoutes); // Mount vendor routes
app.use('/auth/vendor', strictLimiter, vendorAuthRoutes);
app.use('/vendor', vendorRoutes); // Vendor routes with proper authentication
app.use('/', productRoutes); // Legacy product routes (for backward compatibility)
app.use('/', orderRoutes); // Legacy order routes (for backward compatibility)

// ========================================
// ERROR HANDLING
// ========================================

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// ========================================
// GRACEFUL SHUTDOWN
// ========================================

let server;

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  if (server) {
    server.close(() => {
      console.log('Server closed gracefully');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  if (server) {
    server.close(() => {
      console.log('Server closed gracefully');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

// ========================================
// START SERVER
// ========================================

server = app.listen(PORT, () => {
  console.log(`🚀 Community Cart API server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API documentation: http://localhost:${PORT}/api/health`);
});
