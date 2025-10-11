// routes/productRoutes.js - Public and admin product routes
const express = require('express');
const multer = require('multer');
const { verifyAdmin } = require('../middleware/authMiddleware');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

// Multer setup (memory storage for direct Cloudinary upload)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Public router: GET list and details
const publicProductRouter = express.Router();
publicProductRouter.get('/', getProducts);
publicProductRouter.get('/:id', getProductById);

// Admin router: CRUD, protected
const adminProductRouter = express.Router();
adminProductRouter.post('/', verifyAdmin, upload.single('image'), createProduct);
adminProductRouter.put('/:id', verifyAdmin, upload.single('image'), updateProduct);
adminProductRouter.delete('/:id', verifyAdmin, deleteProduct);

module.exports = { publicProductRouter, adminProductRouter };