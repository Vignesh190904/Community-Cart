import express from 'express';
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  updateUiPreferences,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  uploadProfilePic,
  deleteProfilePic,
  addToWishlist,
  removeFromWishlist,
  getWishlist
} from '../controllers/customer.controller.js';
import { getCustomerOrders } from '../controllers/order.controller.js';
import { getMe as get_me } from '../controllers/authCustomer.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { uploadProfilePic as uploadMiddleware } from '../config/uploadConfig.js';

const router = express.Router();

router.post('/profile-pic', protect, uploadMiddleware.single('profile_pic'), uploadProfilePic);
router.delete('/profile-pic', protect, deleteProfilePic);

router.patch('/ui-preferences', protect, updateUiPreferences);
router.patch('/profile', protect, updateProfile);

// Address Routes
router.get('/addresses', protect, getAddresses);
router.post('/addresses', protect, addAddress);
router.put('/addresses/:addrId', protect, updateAddress);
router.delete('/addresses/:addrId', protect, deleteAddress);

// Wishlist Routes
router.post('/wishlist', protect, addToWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);
router.get('/wishlist', protect, getWishlist);

router.get('/orders', protect, getCustomerOrders);

router.get('/me', protect, get_me);
router.post('/', createCustomer);
router.get('/', getAllCustomers);
router.get('/:id', getCustomerById);
router.patch('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

export default router;
