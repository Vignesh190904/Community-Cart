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
  deleteAddress
} from '../controllers/customer.controller.js';
import { getMe as get_me } from '../controllers/authCustomer.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.patch('/ui-preferences', protect, updateUiPreferences);
router.patch('/profile', protect, updateProfile);

// Address Routes
router.get('/addresses', protect, getAddresses);
router.post('/addresses', protect, addAddress);
router.put('/addresses/:addrId', protect, updateAddress);
router.delete('/addresses/:addrId', protect, deleteAddress);
router.get('/me', protect, get_me);
router.post('/', createCustomer);
router.get('/', getAllCustomers);
router.get('/:id', getCustomerById);
router.patch('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

export default router;
