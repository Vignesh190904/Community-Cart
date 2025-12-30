import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        name: String,
        quantity: Number,
        price: Number,
        total: Number,
      },
    ],

    pricing: {
      subtotal: Number,
      deliveryFee: Number,
      tax: Number,
      totalAmount: Number,
    },

    payment: {
      method: { type: String, default: 'COD' },
      status: { type: String, default: 'pending' },
      transactionId: String,
    },

    delivery: {
      address: String,
      instructions: String,
      expectedDate: Date,
    },

    status: { type: String, default: 'pending' }, // pending, accepted, delivered, cancelled
    notes: String,

    extra: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
