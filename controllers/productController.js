// controllers/productController.js - CRUD handlers and Cloudinary uploads
const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary from env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to upload a buffer to Cloudinary
const uploadBufferToCloudinary = (buffer, folder = 'myfirst-fragrances') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
    stream.end(buffer);
  });
};

// POST /api/admin/products - Create new product (admin)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, isPromotion } = req.body;

    if (!name || !description || price === undefined || !category || stock === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    let imageUrl = '';
    if (req.file && req.file.buffer) {
      const uploaded = await uploadBufferToCloudinary(req.file.buffer);
      imageUrl = uploaded.secure_url;
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      stock: Number(stock),
      isPromotion: Boolean(isPromotion) === true || isPromotion === 'true',
      image: imageUrl,
    });

    return res.status(201).json({ success: true, message: 'Product created', data: product });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Create failed', error: err.message });
  }
};

// GET /api/products - Public list
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, message: 'Products fetched', data: products });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Fetch failed', error: err.message });
  }
};

// GET /api/products/:id - Public details
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    return res.status(200).json({ success: true, message: 'Product fetched', data: product });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Fetch failed', error: err.message });
  }
};

// PUT /api/admin/products/:id - Update (admin)
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, isPromotion } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = Number(price);
    if (category !== undefined) updates.category = category;
    if (stock !== undefined) updates.stock = Number(stock);
    if (isPromotion !== undefined) updates.isPromotion = isPromotion === true || isPromotion === 'true';

    if (req.file && req.file.buffer) {
      const uploaded = await uploadBufferToCloudinary(req.file.buffer);
      updates.image = uploaded.secure_url;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    return res.status(200).json({ success: true, message: 'Product updated', data: product });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Update failed', error: err.message });
  }
};

// DELETE /api/admin/products/:id - Delete (admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    return res.status(200).json({ success: true, message: 'Product deleted', data: { id: product._id } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Delete failed', error: err.message });
  }
};

module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct };