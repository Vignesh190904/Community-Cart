import express from 'express';
import { getAnalytics, getKPIs, getProductDetail } from '../controllers/productSales.controller.js';

const router = express.Router();

// Minimal request logging for visibility
router.use((req, _res, next) => {
	console.log(`[product-sales] ${req.method} ${req.path}`);
	next();
});

router.get('/analytics', getAnalytics);
router.get('/kpis', getKPIs);
router.get('/detail/:productId', getProductDetail);

export default router;
