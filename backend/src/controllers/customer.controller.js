import Customer from '../models/Customer.model.js';
import Product from '../models/Product.model.js';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const getAddresses = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    // Sort addresses so primary is always first, though not strictly required by verification criteria, it's good UX
    // But requirement says "First address is automatically primary" (logic-wise).
    // Let's just return them.
    res.status(200).json(customer.addresses);
  } catch (error) {
    res.status(500).json({ message: 'Server error parsing addresses' });
  }
};

export const addAddress = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    if (customer.addresses.length >= 2) {
      return res.status(400).json({ message: 'Maximum 2 addresses allowed' });
    }

    // Strict Schema Enforcement
    const { community, block, floor, flat_number, is_primary } = req.body;

    if (!community || !block || !floor || !flat_number) {
      return res.status(400).json({ message: 'Missing required address fields' });
    }

    const newAddress = {
      community,
      block,
      floor,
      flat_number,
      is_primary: !!is_primary // Ensure boolean
    };

    // Business Logic: First address is automatically primary
    if (customer.addresses.length === 0) {
      newAddress.is_primary = true;
    } else {
      // If adding a second address with is_primary=true, flip the existing one
      if (newAddress.is_primary) {
        customer.addresses.forEach(a => a.is_primary = false);
      } else {
        newAddress.is_primary = false;
      }
    }

    customer.addresses.push(newAddress);
    await customer.save();

    res.status(201).json({ message: 'Address added', addresses: customer.addresses });
  } catch (error) {
    console.error('Add Address Error:', error);
    res.status(500).json({ message: 'Server error adding address' });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { addrId } = req.params;
    const customer = await Customer.findById(req.user.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const address = customer.addresses.id(addrId);
    if (!address) return res.status(404).json({ message: 'Address not found' });

    // Strict Schema Enforcement - Allow partial updates but only of allowed fields
    const { community, block, floor, flat_number, is_primary } = req.body;

    // Apply updates if they exist
    if (community !== undefined) address.community = community;
    if (block !== undefined) address.block = block;
    if (floor !== undefined) address.floor = floor;
    if (flat_number !== undefined) address.flat_number = flat_number;

    // Handle primary swap
    if (is_primary !== undefined) {
      const newPrimaryStatus = !!is_primary;

      if (newPrimaryStatus === true && !address.is_primary) {
        // Setting this to primary -> unset others
        customer.addresses.forEach(a => a.is_primary = false);
        address.is_primary = true;
      } else if (newPrimaryStatus === false && address.is_primary) {
        // Preventing unsetting primary directly
        return res.status(400).json({ message: 'Cannot unset primary address directly. Set another address as primary instead.' });
      }
    }

    await customer.save();

    res.status(200).json({ message: 'Address updated', addresses: customer.addresses });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating address' });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { addrId } = req.params;
    const customer = await Customer.findById(req.user.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const address = customer.addresses.id(addrId);
    if (!address) return res.status(404).json({ message: 'Address not found' });

    const wasPrimary = address.is_primary;

    // Delete the address
    address.deleteOne();

    // If deleted address was primary and another address exists, promote it
    if (wasPrimary && customer.addresses.length > 0) {
      customer.addresses[0].is_primary = true;
    }

    await customer.save();

    res.status(200).json({ message: 'Address deleted', addresses: customer.addresses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting address' });
  }
};

export const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const customer = await Customer.findById(req.user.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Delete old profile picture if exists
    if (customer.profile_pic) {
      const oldFilePath = path.join(__dirname, '../../', customer.profile_pic);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Generate URL path for the uploaded file
    const profilePicUrl = `/uploads/profile-pics/${req.file.filename}`;

    // Update customer profile_pic field
    customer.profile_pic = profilePicUrl;
    await customer.save();

    res.status(200).json({
      message: 'Profile picture uploaded successfully',
      profile_pic: profilePicUrl
    });

  } catch (error) {
    console.error('Upload Profile Pic Error:', error);
    res.status(500).json({ message: 'Server error uploading profile picture' });
  }
};

export const deleteProfilePic = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Delete profile picture file if exists
    if (customer.profile_pic) {
      const filePath = path.join(__dirname, '../../', customer.profile_pic);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Set profile_pic to null
    customer.profile_pic = null;
    await customer.save();

    res.status(200).json({
      message: 'Profile picture deleted successfully',
      profile_pic: null
    });

  } catch (error) {
    console.error('Delete Profile Pic Error:', error);
    res.status(500).json({ message: 'Server error deleting profile picture' });
  }
};

export const updateUiPreferences = async (req, res) => {
  try {
    const { theme } = req.body;

    if (!['light', 'dark'].includes(theme)) {
      return res.status(400).json({ message: 'Invalid theme value. Must be "light" or "dark"' });
    }

    const customer = await Customer.findById(req.user.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    if (!customer.ui_preferences) {
      customer.ui_preferences = {};
    }
    customer.ui_preferences.theme = theme;

    await customer.save();

    res.status(200).json({
      message: 'UI preferences updated',
      ui_preferences: customer.ui_preferences
    });

  } catch (error) {
    console.error('UI Prefs Error:', error);
    res.status(500).json({ message: 'Server error updating preferences' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const { name, phone } = req.body;

    // Only allow updating name and phone (email is read-only)
    if (name !== undefined) customer.name = name;
    if (phone !== undefined) customer.phone = phone;

    await customer.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        addresses: customer.addresses,
        ui_preferences: customer.ui_preferences
      }
    });

  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }
    const customer = new Customer(payload);
    const savedCustomer = await customer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const update = { ...req.body };
    if (update.password) {
      update.password = await bcrypt.hash(update.password, 10);
    }
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.status(200).json({ message: 'Customer deleted successfully', customer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ---------- Wishlist Functions ---------- */

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const customer = await Customer.findById(req.user.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Check for duplicates
    const alreadyInWishlist = customer.wishlist.some(
      (item) => item.product_id.toString() === productId
    );

    if (alreadyInWishlist) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    // Add to wishlist with vendor_id from product
    customer.wishlist.push({
      product_id: productId,
      vendor_id: product.vendor,
      added_at: new Date(),
    });

    await customer.save();

    res.status(201).json({
      message: 'Product added to wishlist',
      wishlist: customer.wishlist,
    });
  } catch (error) {
    console.error('Add to Wishlist Error:', error);
    res.status(500).json({ message: 'Server error adding to wishlist' });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const customer = await Customer.findById(req.user.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Remove product from wishlist
    customer.wishlist = customer.wishlist.filter(
      (item) => item.product_id.toString() !== productId
    );

    await customer.save();

    res.status(200).json({
      message: 'Product removed from wishlist',
      wishlist: customer.wishlist,
    });
  } catch (error) {
    console.error('Remove from Wishlist Error:', error);
    res.status(500).json({ message: 'Server error removing from wishlist' });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id)
      .populate({
        path: 'wishlist.product_id',
        select: 'name price image stock isAvailable category',
      })
      .populate({
        path: 'wishlist.vendor_id',
        select: 'name',
      });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Filter out deleted products and format response
    const wishlistItems = customer.wishlist
      .filter((item) => item.product_id != null) // Skip if product was deleted
      .map((item) => ({
        _id: item._id,
        product: {
          _id: item.product_id._id,
          name: item.product_id.name,
          price: item.product_id.price,
          image: item.product_id.image,
          stock: item.product_id.stock,
          isAvailable: item.product_id.isAvailable,
          category: item.product_id.category,
        },
        vendor: {
          _id: item.vendor_id?._id,
          name: item.vendor_id?.name || 'Unknown Vendor',
        },
        added_at: item.added_at,
      }));

    res.status(200).json(wishlistItems);
  } catch (error) {
    console.error('Get Wishlist Error:', error);
    res.status(500).json({ message: 'Server error fetching wishlist' });
  }
};

