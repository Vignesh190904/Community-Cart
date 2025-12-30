import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema(
  {
    /* ---------- Basic Identity ---------- */
    storeName: String,
    ownerName: String,
    vendorType: String, // grocery, restaurant, pharmacy, etc.

    /* ---------- Contact ---------- */
    contact: {
      phone: String,
      alternatePhone: String,
      email: String,
      whatsapp: String,
    },

    /* ---------- Authentication ---------- */
    password: { type: String, required: true },

    /* ---------- Personal (Owner) ---------- */
    personal: {
      gender: String,
      age: Number,
      dob: Date,
    },

    /* ---------- Address ---------- */
    address: {
      line1: String,
      line2: String,
      area: String,
      city: String,
      state: String,
      pincode: String,
      landmark: String,
      geo: {
        lat: Number,
        lng: Number,
      },
    },

    /* ---------- Business Details ---------- */
    business: {
      gstNumber: String,
      panNumber: String,
      licenseNumber: String,
      establishmentYear: Number,
    },

    /* ---------- Store Operations ---------- */
    store: {
      openingTime: String,
      closingTime: String,
      workingDays: [String],
      deliveryRadiusKm: Number,
      supportsCOD: { type: Boolean, default: true },
      supportsOnlinePayment: { type: Boolean, default: false },
    },

    /* ---------- Metrics ---------- */
    metrics: {
      rating: { type: Number, default: 0 },
      totalOrders: { type: Number, default: 0 },
      completedOrders: { type: Number, default: 0 },
      cancelledOrders: { type: Number, default: 0 },
    },

    /* ---------- Media ---------- */
    media: {
      logoUrl: String,
      bannerUrl: String,
      images: [String],
    },

    /* ---------- Platform Flags ---------- */
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },

    /* ---------- Session Control ---------- */
    tokenVersion: { type: Number, default: 0 },

    /* ---------- Future Use ---------- */
    tags: [String],
    notes: String,
    extra: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

// Virtual field for backward compatibility
vendorSchema.virtual('name').get(function() {
  return this.storeName;
});

// Ensure virtuals are included in JSON output
vendorSchema.set('toJSON', { virtuals: true });
vendorSchema.set('toObject', { virtuals: true });

export default mongoose.model('Vendor', vendorSchema);
