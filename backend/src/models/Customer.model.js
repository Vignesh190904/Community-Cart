import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    email: String,
    password: String,

    personal: {
      gender: String,
      age: Number,
    },

    address: {
      line1: String,
      line2: String,
      area: String,
      city: String,
      state: String,
      pincode: String,
      landmark: String,
    },

    preferences: {
      preferredPaymentMethod: String,
      language: String,
    },

    metrics: {
      totalOrders: { type: Number, default: 0 },
      cancelledOrders: { type: Number, default: 0 },
    },

    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },

    notes: String,
    extra: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.model('Customer', customerSchema);
