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

    category: {
      type: String,
      trim: true,
    },

    // Stock level at which alerts should be raised
    threshold: {
      type: Number,
      default: 0,
      min: 0,
    },

    image: {
      type: String, // URL or relative path
      required: false,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);
