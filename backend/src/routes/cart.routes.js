import express from 'express';
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    syncCart,
    clearCart
} from '../controllers/cart.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect); // All cart routes require login

router.get('/', getCart);
router.post('/sync', syncCart); // For merging initial local state
router.post('/add', addToCart);
router.patch('/:productId', updateCartItem);
router.delete('/:productId', removeFromCart);
router.delete('/', clearCart);

export default router;
