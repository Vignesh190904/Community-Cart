import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    /* ---------- Basic Identity ---------- */
    name: String,
    phone: String,
    email: String,
    password: String, // kept for backward compatibility

    /* ---------- Authentication ---------- */
    auth: {
      method: {
        type: String,
        enum: ['google', 'manual'],
        required: true,
      },

      google: {
        sub: String,
        email_verified: { type: Boolean, default: false },
      },

      manual: {
        password_hash: String,
      },

      last_login_at: Date,
    },

    signup_source: {
      type: String,
      enum: ['google', 'manual'],
    },

    /* ---------- Personal ---------- */
    personal: {
      gender: String,
      age: Number,
    },

    /* ---------- Addresses (NEW – max 2) ---------- */
    addresses: [
      {
        community: { type: String, required: true, trim: true },
        block: { type: String, required: true, trim: true },
        floor: { type: String, required: true, trim: true },
        flat_number: { type: String, required: true, trim: true },
        is_primary: { type: Boolean, default: false },
      },
    ],

    /* ---------- Preferences ---------- */
    preferences: {
      preferredPaymentMethod: String,
      language: String,
    },

    /* ---------- UI Preferences ---------- */
    ui_preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light',
      },
    },

    /* ---------- Verification ---------- */
    verification: {
      email_verified: { type: Boolean, default: false },
      phone_verified: { type: Boolean, default: false },
    },

    /* ---------- Metrics ---------- */
    metrics: {
      totalOrders: { type: Number, default: 0 },
      cancelledOrders: { type: Number, default: 0 },
    },

    /* ---------- Platform Flags ---------- */
    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },

    /* ---------- Notes / Extensibility ---------- */
    notes: String,
    extra: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

// Indexes for performance and uniqueness
customerSchema.index({ email: 1 }, { unique: true, sparse: true });

export default mongoose.model('Customer', customerSchema);