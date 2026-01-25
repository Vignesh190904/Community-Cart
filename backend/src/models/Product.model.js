import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      trim: true,
    },

    // Price per sellable unit (e.g. per 500g, 1L, 1 pack)
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // Manufacturer's suggested retail price
    mrp: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Quantity of a single sellable unit
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    // Unit of measurement for quantity
    unit: {
      type: String,
      enum: ["g", "kg", "ml", "l", "pcs"],
      required: true,
    },

    // Available stock count (number of such units)
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Stock alert threshold
    threshold: {
      type: Number,
      default: 0,
      min: 0,
    },

    image: {
      type: String, // URL or relative path
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);
