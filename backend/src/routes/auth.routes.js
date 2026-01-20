import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/User.model.js';
import Vendor from '../models/Vendor.model.js';
import Customer from '../models/Customer.model.js';
import { logout } from '../controllers/authCustomer.controller.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

const signToken = (user) => {
  const payload = { id: user._id, role: user.role };
  if (user.tokenVersion !== undefined) payload.tokenVersion = user.tokenVersion;
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const authGuard = async (req, res, next) => {
  try {
    const auth_token = req.cookies?.auth_token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);

    if (!auth_token) {
      return res.status(401).json({ success: false, message: 'Authorization token missing' });
    }

    const decoded = jwt.verify(auth_token, JWT_SECRET);

    let principal = null;
    if (decoded.role === 'vendor') {
      principal = await Vendor.findById(decoded.id).select('-password');
      if (principal && decoded.tokenVersion !== undefined && decoded.tokenVersion !== principal.tokenVersion) {
        return res.status(401).json({ success: false, message: 'Session expired.' });
      }
    } else {
      principal = await User.findById(decoded.id).select('-password');
      if (!principal) {
        principal = await Customer.findById(decoded.id).select('-password');
      }
    }

    if (!principal || principal.isActive === false) {
      return res.status(401).json({ success: false, message: 'Account inactive' });
    }

    req.user = principal;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

router.post('/logout', logout);

router.get('/me', authGuard, (req, res) => {
  try {
    const customer = req.user;
    const is_onboarded = !!(customer.name && customer.phone && customer.addresses?.some(a => a.is_primary));

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          method: customer.auth?.method || 'manual',
          is_onboarded: is_onboarded,
          ui_preferences: customer.ui_preferences || { theme: 'light' }
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Missing fields' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });
    const auth_token = signToken(user);

    return res.status(201).json({ success: true, data: { user, auth_token } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    let userData = null;

    if (user && user.isActive && await bcrypt.compare(password, user.password)) {
      userData = { id: user._id, name: user.name, email: user.email, role: user.role };
    }

    if (!userData) {
      const vendor = await Vendor.findOne({ 'contact.email': email });
      if (vendor && vendor.isActive && await bcrypt.compare(password, vendor.password)) {
        userData = { id: vendor._id, name: vendor.storeName, email: vendor.contact.email, role: 'vendor' };
      }
    }

    if (!userData) {
      const customer = await Customer.findOne({ email });
      if (customer && customer.isActive) {
        const stored = customer.password || customer.auth?.manual?.password_hash || '';
        if (await bcrypt.compare(password, stored)) {
          userData = { id: customer._id, name: customer.name, email: customer.email, role: 'user' };
        }
      }
    }

    if (!userData) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const auth_token = signToken({ _id: userData.id, role: userData.role });

    res.cookie('auth_token', auth_token, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      path: '/'
    });

    // CRITICAL: Return token in body as well
    return res.json({ success: true, data: { user: userData, auth_token } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Login failed' });
  }
});

export default router;