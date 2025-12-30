import mongoose from 'mongoose';
import Order from '../models/Order.model.js';
import Product from '../models/Product.model.js';
import Customer from '../models/Customer.model.js';
import Counter from '../models/Counter.model.js';

// Atomically increment counter and return next order number
const getNextOrderNumber = async () => {
  const counter = await Counter.findOneAndUpdate(
    { _id: 'order' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  if (!counter) {
    throw new Error('Failed to generate order number');
  }

  return `ORD-${String(counter.seq).padStart(6, '0')}`;
};

export const createOrder = async (req, res) => {
  try {
    const { customerId, productIds, items: bodyItems } = req.body;

    // Normalize incoming items: support legacy productIds[] or new items[{productId, quantity}]
    const normalizedItems = Array.isArray(bodyItems) && bodyItems.length > 0
      ? bodyItems.map((i) => ({ productId: i.productId || i._id, quantity: Math.max(1, Number(i.quantity) || 1) }))
      : Array.isArray(productIds) ? productIds.map((pid) => ({ productId: pid, quantity: 1 })) : [];

    if (!normalizedItems || normalizedItems.length === 0) {
      return res.status(400).json({ error: 'No products provided' });
    }

    // Validate customer status (disabled customers cannot order)
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    if (customer.isActive === false || customer.isBlocked === true) {
      return res.status(403).json({ error: 'Customer is disabled' });
    }

    // Fetch products to calculate total and get vendor (do not trust vendorId from client)
    const products = await Product.find({ _id: { $in: normalizedItems.map((i) => i.productId) } }).populate('vendor');
    
    if (products.length === 0) {
      return res.status(404).json({ error: 'No valid products found' });
    }

    // For simplicity, assume all products from same vendor (first product's vendor)
    const vendor = products[0].vendor;
    const vendorId = vendor?._id;
    if (!vendorId) {
      return res.status(400).json({ error: 'Product has no vendor assigned' });
    }
    if (vendor?.isActive === false) {
      return res.status(403).json({ error: 'Vendor is currently disabled' });
    }

    // Validate product availability and stock
    for (const item of normalizedItems) {
      const p = products.find((prod) => prod._id.toString() === item.productId.toString());
      if (!p) {
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }
      if (p.isAvailable === false) {
        return res.status(400).json({ error: `Product ${p.name} is not available` });
      }
      const requestedQty = item.quantity || 1;
      if (p.stock < requestedQty) {
        return res.status(400).json({ error: `Insufficient stock for ${p.name}` });
      }
    }

    const orderNumber = await getNextOrderNumber();

    // Build order items
    const items = normalizedItems.map((item) => {
      const p = products.find((prod) => prod._id.toString() === item.productId.toString());
      return {
        productId: p._id,
        name: p.name,
        quantity: item.quantity,
        price: p.price,
        total: p.price * item.quantity,
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const deliveryFee = 0;
    const tax = 0;
    const totalAmount = subtotal + deliveryFee + tax;

    const order = new Order({
      orderNumber,
      customerId,
      vendorId,
      items,
      pricing: { subtotal, deliveryFee, tax, totalAmount },
      status: 'pending',
    });

    const savedOrder = await order.save();
    console.log(
      '[order:create] orderNumber=',
      orderNumber,
      'vendorId=',
      vendorId?.toString(),
      'orderId=',
      savedOrder._id.toString()
    );
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { vendorId, status } = req.query;
    const filter = {};

    // Base vendor filter
    if (vendorId) filter.vendorId = vendorId;

    // Parse statuses (if provided)
    let statuses = null;
    if (status) {
      statuses = status.includes(',') ? status.split(',').map(s => s.trim()) : [status];
    }

    // Vendor-specific logic: pending/processing are unbounded by date; completed/cancelled limited to today
    if (vendorId && statuses) {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

      const orClauses = [];
      if (statuses.includes('pending')) orClauses.push({ status: 'pending' });
      if (statuses.includes('processing')) orClauses.push({ status: 'processing' });
      if (statuses.includes('completed')) orClauses.push({ status: 'completed', createdAt: { $gte: startOfToday, $lt: endOfToday } });
      if (statuses.includes('cancelled')) orClauses.push({ status: 'cancelled', createdAt: { $gte: startOfToday, $lt: endOfToday } });

      if (orClauses.length > 0) {
        filter.$or = orClauses;
      }
    } else if (statuses) {
      // Global/admin listing: simple status filter, no date constraints
      filter.status = statuses.length > 1 ? { $in: statuses } : statuses[0];
    }

    console.log('[orders:list] vendorId=', vendorId || 'all', 'status=', status || 'all', vendorId ? '(vendor: today for completed/cancelled)' : '');

    const orders = await Order.find(filter)
      .populate('customerId', 'name email phone')
      .populate('vendorId', 'storeName ownerName email')
      .populate('items.productId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customerId', 'name email phone')
      .populate('vendorId', 'storeName ownerName email');
    
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Validate status transitions
    const validTransitions = {
      pending: ['processing', 'cancelled'],
      processing: ['completed', 'cancelled'],
      completed: [],
      cancelled: [],
    };

    // No-op if same status requested
    if (status === order.status) {
      return res.status(200).json(order);
    }

    if (!validTransitions[order.status].includes(status)) {
      return res.status(400).json({ 
        error: `Invalid transition from ${order.status} to ${status}` 
      });
    }

    // Perform status update and any stock adjustments atomically
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        // When moving to processing (vendor accepts), decrement stock
        if (order.status === 'pending' && status === 'processing') {
          // Validate stock availability first
          const productIds = order.items.map((i) => i.productId);
          const products = await Product.find({ _id: { $in: productIds } }).session(session);

          // Build a quick lookup for current stocks
          const stockMap = new Map(products.map((p) => [p._id.toString(), p.stock]));

          for (const item of order.items) {
            const pid = item.productId.toString();
            const current = stockMap.get(pid) ?? 0;
            if (current < item.quantity) {
              throw new Error(`Insufficient stock for product ${pid}. Available: ${current}, required: ${item.quantity}`);
            }
          }

          // Apply stock decrement per item
          for (const item of order.items) {
            const pid = item.productId.toString();
            const current = stockMap.get(pid) ?? 0;
            const nextStock = current - item.quantity;
            await Product.updateOne(
              { _id: item.productId },
              { $inc: { stock: -item.quantity }, $set: { isAvailable: nextStock > 0 } },
              { session }
            );
          }
        }

        // When cancelling after processing, restore stock
        if (order.status === 'processing' && status === 'cancelled') {
          for (const item of order.items) {
            await Product.updateOne(
              { _id: item.productId },
              { $inc: { stock: item.quantity }, $set: { isAvailable: true } },
              { session }
            );
          }
        }

        // Persist order status change
        order.status = status;
        await order.save({ session });
      });

      // Return updated order (no populate for performance)
      res.status(200).json(order);
    } catch (err) {
      // Map transaction errors to 400 to surface message to client
      res.status(400).json({ error: err.message || 'Failed to update order status' });
    } finally {
      session.endSession();
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};