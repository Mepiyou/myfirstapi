// server.js - Entry point for MyFirst Fragrances backend
// Sets up Express server, middleware, DB connection, and routes

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const { publicProductRouter, adminProductRouter } = require('./routes/productRoutes');

const app = express();

// Connect to MongoDB
// Connect to MongoDB (Middleware to ensure connection)
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Global middleware
app.use(cors());
app.use(express.json({ limit: '5mb' })); // Parse JSON bodies
app.use(morgan('dev'));

// Health check
app.get('/', (req, res) => {
  return res.status(200).json({ success: true, message: 'MyFirst Fragrances API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', publicProductRouter); // Public routes
app.use('/api/admin/products', adminProductRouter); // Admin-protected routes

// Global 404 handler
app.use((req, res) => {
  return res.status(404).json({ success: false, message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 4000;
// Export app for Vercel
module.exports = app;

// Start server only if running directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`MyFirst Fragrances backend listening on port ${PORT}`);
  });
}
