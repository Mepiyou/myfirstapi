// models/Product.js - Product model for MyFirst Fragrances
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, min: 0 },
    image: { type: String, default: '' }, // Cloudinary URL
    isPromotion: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
