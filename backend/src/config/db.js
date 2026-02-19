import mongoose from 'mongoose';
import ENV from './env.js';

let isConnected = false;
let lastError = null;

export const connectDB = async () => {
  const uri = ENV.MONGO_URI;
  if (!uri) {
    console.error('MongoDB connection failed: MONGO_URI is missing in .env');
    isConnected = false;
    lastError = new Error('MONGO_URI missing');
    return;
  }

  try {
    await mongoose.connect(uri);
    isConnected = true;
    lastError = null;
    console.log('✅ MongoDB connected');
  } catch (error) {
    isConnected = false;
    lastError = error;
    // Do not log here; server will print a single unified status
    // Do not exit; allow server to run and report health status
  }
};

mongoose.connection.on('connected', () => {
  isConnected = true;
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
});

mongoose.connection.on('error', (err) => {
  isConnected = false;
  lastError = err;
});

export const getDbStatus = () => ({ connected: isConnected, error: lastError ? lastError.message : null });
