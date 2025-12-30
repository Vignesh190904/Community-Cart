/**
 * Auth Module - Reusable authentication and registration system
 * 
 * A complete authentication solution for Node.js/Express applications
 * Features: JWT auth, OAuth, role-based access, user management
 * 
 * @example
 * // Import the entire module
 * const auth = require('./modules/auth');
 * 
 * // Or import specific components
 * const { authRoutes, protect, UserModel } = require('./modules/auth');
 * 
 * // Use in Express app
 * app.use('/api/auth', auth.authRoutes);
 * app.get('/protected', auth.authMiddleware.protect, handler);
 */

module.exports = {
  // Controllers
  authController: require('./controllers/authController'),
  
  // Routes
  authRoutes: require('./routes/authRoutes'),
  oauthRoutes: require('./routes/oauthRoutes'),
  
  // Middleware
  authMiddleware: require('./middleware/authMiddleware'),
  protect: require('./middleware/authMiddleware').protect,
  authorize: require('./middleware/authMiddleware').authorize,
  adminOnly: require('./middleware/authMiddleware').adminOnly,
  managerAccess: require('./middleware/authMiddleware').managerAccess,
  
  // Config
  passportConfig: require('./config/passport'),
  
  // Models
  UserModel: require('./models/User'),
  
  // Utils
  tokenUtils: require('./utils/tokenUtils'),
  generateToken: require('./utils/tokenUtils').generateToken,
  verifyToken: require('./utils/tokenUtils').verifyToken,
  validationRules: require('./utils/validationRules')
};
