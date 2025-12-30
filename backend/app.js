import express from 'express';
import cors from 'cors';
import { getDbStatus } from './src/config/db.js';
import vendorRoutes from './src/routes/vendor.routes.js';
import customerRoutes from './src/routes/customer.routes.js';
import productRoutes from './src/routes/product.routes.js';
import orderRoutes from './src/routes/order.routes.js';
import productSalesRoutes from './src/routes/productSales.routes.js';
import authRoutes from './src/routes/auth.routes.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:4646',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// Increase body parser limits to support profile avatar data URLs
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

app.get('/health', (_, res) => {
  const status = getDbStatus();
  res.status(200).json({ ok: true, dbConnected: status.connected, dbError: status.error });
});

app.use('/api/vendors', vendorRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/product-sales', productSalesRoutes);
// Quick health endpoint to verify product-sales routes
app.get('/api/product-sales/health', (_req, res) => {
  res.status(200).json({ ok: true, message: 'product-sales routes mounted' });
});
app.use('/api/auth', authRoutes);

export default app;
