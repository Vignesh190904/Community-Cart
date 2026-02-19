// CRITICAL: Load environment variables FIRST before any imports
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

// Now import everything else AFTER dotenv is configured
import express from 'express';
import cors from 'cors';

import helmet from 'helmet';
import { connectDB, getDbStatus } from './src/config/db.js';

// Route Imports
console.log('🔄 Importing routes...');
import authRoutes from './src/routes/auth.routes.js';
import authCustomerRoutes from './src/routes/authCustomer.routes.js';
import vendorRoutes from './src/routes/vendor.routes.js';
import customerRoutes from './src/routes/customer.routes.js';
import productRoutes from './src/routes/product.routes.js';
import orderRoutes from './src/routes/order.routes.js';
import productSalesRoutes from './src/routes/productSales.routes.js';
console.log('✅ Routes imported');
import cartRoutes from './src/routes/cart.routes.js';

console.log('🔄 Creating Express app...');
const app = express();
console.log('✅ Express app created');

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false
  })
);

// 1. CORS - Production Aware
const isProd = process.env.NODE_ENV === 'production';
app.use(cors({
  origin: isProd ? process.env.FRONTEND_URL : "http://localhost:4646",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Standard Middlewares
app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// 2.5. Static File Serving for Uploads
// app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. Session Configuration (REMOVED - Using JWT)
// app.use(session({...}));

// 4. Request Logging (For debugging 401/403)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 4.5. DB Connection Guard (For Serverless & Safety)
let dbReady = false;

const ensureDBConnection = async () => {
  if (!getDbStatus().connected) {
    await connectDB();
  }
  dbReady = true;
};

app.use(async (req, res, next) => {
  try {
    if (!dbReady) {
      await ensureDBConnection();
    }
    next();
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
    });
  }
});

// 5. Route Mounting (Unified prefix)
app.get('/api/health', (req, res) => {
  const dbStatus = getDbStatus();
  res.status(200).json({
    status: 'ok',
    backend: 'running',
    database: dbStatus.connected ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/auth/customer', authCustomerRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/product-sales', productSalesRoutes);
app.use('/api/cart', cartRoutes);

// 6. Global Error Handler (Prevents ugly 500 crashes)
app.use((err, req, res, next) => {
  console.error('[GLOBAL ERROR]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error_code: err.code || 'SERVER_ERROR'
  });
});

export default app;