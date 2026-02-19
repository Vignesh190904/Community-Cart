import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';

import { protectVendor } from '../middlewares/auth.middleware.js';
import { uploadSingleImage } from '../middleware/memoryUpload.js';

const router = express.Router();

router.post('/', protectVendor, uploadSingleImage('image'), createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
