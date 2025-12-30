import express from 'express';
import {
  createVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
  forceLogoutVendor,
} from '../controllers/vendor.controller.js';
import { getVendorEarnings } from '../controllers/vendor.controller.js';

const router = express.Router();

router.post('/', createVendor);
router.get('/', getAllVendors);
router.get('/:vendorId/earnings', getVendorEarnings);
router.post('/:id/force-logout', forceLogoutVendor);
router.get('/:id', getVendorById);
router.put('/:id', updateVendor);
router.delete('/:id', deleteVendor);

export default router;
