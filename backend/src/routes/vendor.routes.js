import express from 'express';
import {
  createVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
  forceLogoutVendor,
  getVendorMe,
} from '../controllers/vendor.controller.js';
import { getVendorEarnings } from '../controllers/vendor.controller.js';
import { getVendorOrders } from '../controllers/order.controller.js';
import { protectVendor } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/me', protectVendor, getVendorMe);
router.get('/orders', protectVendor, getVendorOrders);
router.post('/', createVendor);
router.get('/', getAllVendors);
router.get('/:vendorId/earnings', getVendorEarnings);
router.post('/:id/force-logout', forceLogoutVendor);
router.get('/:id', getVendorById);
router.put('/:id', updateVendor);
router.delete('/:id', deleteVendor);

export default router;
