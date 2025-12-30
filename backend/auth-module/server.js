const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
require('dotenv').config();

// Import database configuration FIRST (configures mongoose)
const { mongoose, connectDB } = require('./config/database');

// Import auth module AFTER database configuration
const auth = require('./index');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Session configuration (required for OAuth)
app.use(session({
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Initialize passport config
require('./config/passport');

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'auth-service',
    timestamp: new Date().toISOString()
  });
});

// Auth routes
app.use('/api/auth', auth.authRoutes);
app.use('/api/auth', auth.oauthRoutes);

// Example: Verify token endpoint (for other services)
app.post('/api/auth/verify-token', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }

    const decoded = auth.tokenUtils.verifyToken(token);
    const user = await auth.UserModel.findById(decoded.id).select('-password');

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or inactive user'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone
        }
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Connect to MongoDB and start server
const PORT = process.env.AUTH_SERVICE_PORT || 5000;

// MongoDB connection event handlers
mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('📴 Mongoose disconnected from MongoDB');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 Mongoose reconnected to MongoDB');
});

async function startServer() {
  try {
    console.log('⏳ Connecting to MongoDB (this may take 10-30 seconds)...');
    console.log('📍 MongoDB URI:', process.env.MONGODB_URI ? 'Set (hidden)' : 'NOT SET');
    console.log('🔧 Buffer commands:', mongoose.get('bufferCommands'));
    
    // Connect using centralized config
    await connectDB(process.env.MONGODB_URI);
    
    // Test query to ensure models work
    try {
      const User = auth.UserModel;
      const count = await User.countDocuments();
      console.log('👥 Users in database:', count);
      
      // Try a simple findOne to verify no buffering
      const testUser = await User.findOne().limit(1);
      console.log('🧪 Test query successful:', testUser ? 'User found' : 'No users yet');
    } catch (e) {
      console.error('⚠️  Test query failed:', e.message);
      throw new Error('Database queries not working: ' + e.message);
    }
    
    // List collections
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('📚 Collections:', collections.map(c => c.name).join(', ') || 'none yet');
    } catch (e) {
      console.log('📚 Collections: Unable to list');
    }
    
    // Wait for stability
    console.log('⏳ Waiting 3 seconds for connection stability...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Start server
    app.listen(PORT, () => {
      console.log('');
      console.log('═══════════════════════════════════════');
      console.log('🚀 Auth Service running on port', PORT);
      console.log('═══════════════════════════════════════');
      console.log('📍 Health: http://localhost:' + PORT + '/health');
      console.log('🔐 Auth: http://localhost:' + PORT + '/api/auth');
      console.log('═══════════════════════════════════════');
      console.log('');
      console.log('✅ READY TO ACCEPT REQUESTS!');
      console.log('   Test: curl http://localhost:' + PORT + '/health');
      console.log('');
    });
  } catch (err) {
    console.error('');
    console.error('═══════════════════════════════════════');
    console.error('❌ STARTUP FAILED');
    console.error('═══════════════════════════════════════');
    console.error('Error:', err.message);
    console.error('');
    console.error('💡 Troubleshooting:');
    console.error('   1. Check MONGODB_URI in .env');
    console.error('   2. Add 0.0.0.0/0 to MongoDB Atlas IP whitelist');
    console.error('   3. Wait 2-3 minutes after IP whitelist change');
    console.error('   4. Run: node ../test-mongodb.js');
    console.error('   5. Check MongoDB Atlas cluster is Active');
    console.error('');
    console.error('═══════════════════════════════════════');
    process.exit(1);
  }
}

// Start the server
startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});
