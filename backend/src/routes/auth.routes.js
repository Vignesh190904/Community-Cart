import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/User.model.js';
import Vendor from '../models/Vendor.model.js';
import Customer from '../models/Customer.model.js';

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
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization header missing' });
    }
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    let principal = null;
    if (decoded.role === 'vendor') {
      principal = await Vendor.findById(decoded.id).select('-password');
      if (principal && decoded.tokenVersion !== undefined && decoded.tokenVersion !== principal.tokenVersion) {
        return res.status(401).json({ success: false, message: 'Session expired. Please sign in again.' });
      }
    } else {
      principal = await User.findById(decoded.id).select('-password');
      if (!principal && decoded.role === 'user') {
        principal = await Customer.findById(decoded.id).select('-password');
      }
    }

    if (!principal || principal.isActive === false) {
      return res.status(401).json({ success: false, message: 'Account not found or inactive' });
    }
    req.user = principal;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'name, email, and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });
    const token = signToken(user);

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive
        },
        token
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'email and password are required' });
    }

    // First, try to find user in User collection
    let user = await User.findOne({ email });
    let role = null;
    let userData = null;

    if (user && user.isActive) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        role = user.role;
        userData = {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive
        };
      }
    }

    // If not found in User collection, check Vendor collection
    if (!userData) {
      const vendor = await Vendor.findOne({ 'contact.email': email });
      if (vendor && vendor.isActive) {
        const match = await bcrypt.compare(password, vendor.password);
        if (match) {
          role = 'vendor';
          userData = {
            id: vendor._id,
            name: vendor.storeName,
            email: vendor.contact.email,
            role: 'vendor',
            isActive: vendor.isActive,
            tokenVersion: vendor.tokenVersion || 0,
          };
        }
      }
    }

    // If not found in User or Vendor, check Customer collection
    if (!userData) {
      const customer = await Customer.findOne({ email });
      if (customer && customer.isActive) {
        const stored = customer.password || '';
        const looksHashed = stored.startsWith('$2a$') || stored.startsWith('$2b$') || stored.startsWith('$2y$');
        let match = false;

        if (stored && looksHashed) {
          try {
            match = await bcrypt.compare(password, stored);
          } catch (_) {
            match = false;
          }
        } else if (stored && !looksHashed) {
          // Legacy plaintext password: compare directly, then upgrade to hashed
          if (password === stored) {
            match = true;
            try {
              const hashed = await bcrypt.hash(stored, 10);
              customer.password = hashed;
              await customer.save();
            } catch (_) {}
          }
        }

        if (match) {
          role = 'user';
          userData = {
            id: customer._id,
            name: customer.name,
            email: customer.email,
            role: 'user',
            isActive: customer.isActive
          };
        }
      }
    }

    if (!userData) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = signToken({ _id: userData.id, role: userData.role, tokenVersion: userData.tokenVersion });

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        token
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
});

router.get('/me', authGuard, (req, res) => {
  const base = req.user && typeof req.user.toObject === 'function' ? req.user.toObject() : req.user;
  const user = { ...base, role: req.userRole };
  return res.json({ success: true, data: { user } });
});

// Change password (vendor-side allowed; requires current password)
router.post('/change-password', async (req, res) => {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization header missing' });
    }
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'currentPassword and newPassword are required' });
    }
    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });
    }

    // Support vendor and user/customer accounts
    let principal = null;
    let modelType = decoded.role;
    if (decoded.role === 'vendor') {
      principal = await Vendor.findById(decoded.id);
    } else if (decoded.role === 'user') {
      principal = await Customer.findById(decoded.id);
    } else {
      principal = await User.findById(decoded.id);
    }

    if (!principal || principal.isActive === false) {
      return res.status(401).json({ success: false, message: 'Account not found or inactive' });
    }

    const stored = principal.password || '';
    const looksHashed = stored.startsWith('$2a$') || stored.startsWith('$2b$') || stored.startsWith('$2y$');
    let match = false;
    if (stored && looksHashed) {
      match = await bcrypt.compare(currentPassword, stored);
    } else {
      // Legacy plaintext support
      match = currentPassword === stored;
    }
    if (!match) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    principal.password = hashed;
    await principal.save();

    return res.json({ success: true, message: 'Password updated successfully', data: { role: modelType, id: principal._id } });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
});

export default router;
