// CRITICAL: Load environment variables FIRST before any imports
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

// Now import everything else AFTER dotenv is configured
import express from 'express';
import cors from 'cors';

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

console.log('🔄 Creating Express app...');
const app = express();
console.log('✅ Express app created');

// 1. CORS - Specific for Port 4646
app.use(cors({
  origin: 'http://localhost:4646',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Standard Middlewares
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// 2.5. Static File Serving for Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. Session Configuration (REMOVED - Using JWT)
// app.use(session({...}));

// 4. Request Logging (For debugging 401/403)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 5. Route Mounting (Unified prefix)
app.use('/api/auth', authRoutes);
app.use('/api/auth/customer', authCustomerRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/product-sales', productSalesRoutes);

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