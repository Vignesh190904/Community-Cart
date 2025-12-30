import mongoose from 'mongoose';
import Vendor from '../models/Vendor.model.js';
import bcrypt from 'bcryptjs';
import Order from '../models/Order.model.js';

export const createVendor = async (req, res) => {
  try {
    // Hash password if provided
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    const vendor = new Vendor(req.body);
    const savedVendor = await vendor.save();
    // Don't send password in response
    const vendorObj = savedVendor.toObject();
    delete vendorObj.password;
    res.status(201).json(vendorObj);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().select('-password');
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getVendorEarnings = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { from, to, status: statusParam, orderAboveAvg, minUnitsPerOrder, minOrderValue } = req.query;

    // Parse and validate date parameters
    let matchStage = {
      vendorId: new mongoose.Types.ObjectId(vendorId),
    };

    if (from || to) {
      matchStage.createdAt = {};
      if (from) {
        const fromDate = new Date(from);
        if (isNaN(fromDate.getTime())) {
          return res.status(400).json({ error: 'Invalid "from" date format' });
        }
        matchStage.createdAt.$gte = fromDate;
      }
      if (to) {
        const toDate = new Date(to);
        if (isNaN(toDate.getTime())) {
          return res.status(400).json({ error: 'Invalid "to" date format' });
        }
        // Set to end of day
        toDate.setHours(23, 59, 59, 999);
        matchStage.createdAt.$lte = toDate;
      }
    }

    // Parse status filter (default: completed and cancelled)
    const statuses = statusParam ? statusParam.split(',').map(s => s.trim()) : ['completed', 'cancelled'];
    matchStage.status = { $in: statuses };

    console.log('[vendor:earnings] vendorId=', vendorId, 'filters=', { from: from || null, to: to || null, status: statuses });

    // First, calculate average order value if orderAboveAvg filter is enabled
    let averageOrderValueThreshold = 0;
    if (orderAboveAvg === 'true') {
      const avgPipeline = [
        {
          $match: {
            vendorId: new mongoose.Types.ObjectId(vendorId),
            status: 'completed',
            ...(matchStage.createdAt && { createdAt: matchStage.createdAt }),
          },
        },
        {
          $group: {
            _id: null,
            avgAmount: { $avg: '$pricing.totalAmount' },
          },
        },
      ];
      const avgResult = await Order.aggregate(avgPipeline);
      averageOrderValueThreshold = avgResult.length > 0 ? avgResult[0].avgAmount : 0;
      
      // Add filter for orders above average
      if (averageOrderValueThreshold > 0) {
        matchStage['pricing.totalAmount'] = { $gt: averageOrderValueThreshold };
      }
    }

    // Add min units per order filter
    if (minUnitsPerOrder && !isNaN(parseInt(minUnitsPerOrder))) {
      const minUnits = parseInt(minUnitsPerOrder);
      if (minUnits > 0) {
        matchStage.$expr = {
          $gte: [
            { $sum: '$items.quantity' },
            minUnits,
          ],
        };
      }
    }

    // Add min order value filter
    if (minOrderValue && !isNaN(parseFloat(minOrderValue))) {
      const minValue = parseFloat(minOrderValue);
      if (minValue > 0) {
        matchStage['pricing.totalAmount'] = matchStage['pricing.totalAmount'] || {};
        matchStage['pricing.totalAmount'].$gte = minValue;
      }
    }

    // MongoDB aggregation pipeline
    const pipeline = [
      // Match orders for this vendor with specified filters
      { $match: matchStage },

      // Separate stats for completed and cancelled orders
      {
        $group: {
          _id: '$status',
          totalAmount: { $sum: '$pricing.totalAmount' },
          count: { $sum: 1 },
          distinctCustomers: { $addToSet: '$customerId' },
          totalQuantity: {
            $sum: {
              $cond: [{ $isArray: '$items' }, { $sum: '$items.quantity' }, 0],
            },
          },
        },
      },
    ];

    const results = await Order.aggregate(pipeline);

    // Process results
    let totalEarnings = 0;
    let totalCancelledValue = 0;
    let completedOrdersCount = 0;
    let cancelledOrdersCount = 0;
    let totalUnitsSold = 0;
    let customersServed = new Set();

    results.forEach((result) => {
      if (result._id === 'completed') {
        totalEarnings = result.totalAmount;
        completedOrdersCount = result.count;
        totalUnitsSold = result.totalQuantity;
        result.distinctCustomers.forEach((cid) => {
          if (cid) customersServed.add(cid.toString());
        });
      } else if (result._id === 'cancelled') {
        totalCancelledValue = result.totalAmount;
        cancelledOrdersCount = result.count;
      }
    });

    // Calculate average order value
    const averageOrderValue =
      completedOrdersCount > 0 ? totalEarnings / completedOrdersCount : 0;

    const response = {
      filters: {
        from: from || null,
        to: to || null,
        status: statuses,
      },
      metrics: {
        totalEarnings: Number(totalEarnings.toFixed(2)),
        totalCancelledValue: Number(totalCancelledValue.toFixed(2)),
        completedOrdersCount,
        cancelledOrdersCount,
        totalUnitsSold,
        customersServed: customersServed.size,
        averageOrderValue: Number(averageOrderValue.toFixed(2)),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[vendor:earnings] error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getVendorById = async (req, res) => {
  try {
    const includePassword = req.query.includePassword === 'true';
    let query = Vendor.findById(req.params.id);
    if (!includePassword) query = query.select('-password');
    const vendor = await query;
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    res.status(200).json(vendor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateVendor = async (req, res) => {
  try {
    // Hash password if it's being updated
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    res.status(200).json(vendor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    res.status(200).json({ message: 'Vendor deleted successfully', vendor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const forceLogoutVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });

    vendor.tokenVersion = (vendor.tokenVersion || 0) + 1;
    await vendor.save();

    res.status(200).json({ message: 'Vendor sessions invalidated', tokenVersion: vendor.tokenVersion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
