/**
 * Database Configuration
 * Centralized mongoose instance to prevent buffering issues
 */
const mongoose = require('mongoose');

// Configure mongoose BEFORE any models are loaded
mongoose.set('bufferCommands', false);
mongoose.set('bufferTimeoutMS', 30000);
mongoose.set('strictQuery', false);

// Connection options
const mongooseOptions = {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
  maxPoolSize: 10,
  minPoolSize: 2,
  family: 4,
  retryWrites: true,
  w: 'majority'
};

/**
 * Connect to MongoDB
 * @param {string} uri - MongoDB connection string
 * @returns {Promise} Connection promise
 */
const connectDB = async (uri) => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    await mongoose.connect(uri, mongooseOptions);
    
    // Verify connection
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Connection not ready');
    }
    
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🔗 Connection state:', mongoose.connection.readyState);
    
    // Ping to verify
    await mongoose.connection.db.admin().ping();
    console.log('🏓 MongoDB ping successful');
    
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
};

/**
 * Close MongoDB connection
 */
const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('📴 MongoDB connection closed');
  } catch (error) {
    console.error('Error closing MongoDB:', error);
  }
};

// Export configured mongoose instance
module.exports = {
  mongoose,
  connectDB,
  closeDB,
  mongooseOptions
};
