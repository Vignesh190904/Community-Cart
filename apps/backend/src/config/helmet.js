/**
 * Helmet security configuration for Community Cart backend
 * Provides basic security headers and protections
 */

const helmet = require('helmet');

/**
 * Helmet configuration options
 */
const helmetOptions = {
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
    },
  },

  // Cross-Origin Embedder Policy
  crossOriginEmbedderPolicy: false, // Disable for file uploads

  // Cross-Origin Resource Policy
  crossOriginResourcePolicy: {
    policy: "cross-origin" // Allow cross-origin requests for API
  },

  // DNS Prefetch Control
  dnsPrefetchControl: {
    allow: false
  },

  // Frame Options
  frameguard: {
    action: 'deny'
  },

  // Hide Powered-By header
  hidePoweredBy: true,

  // HTTP Strict Transport Security
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },

  // IE No Open
  ieNoOpen: true,

  // No Sniff
  noSniff: true,

  // Origin Agent Cluster
  originAgentCluster: true,

  // Permitted Cross-Domain Policies
  permittedCrossDomainPolicies: false,

  // Referrer Policy
  referrerPolicy: {
    policy: "no-referrer"
  },

  // X-XSS-Protection
  xssFilter: true
};

/**
 * Create helmet middleware with configuration
 */
const helmetMiddleware = helmet(helmetOptions);

module.exports = {
  helmetMiddleware,
  helmetOptions
};
