// controllers/authController.js - Handles admin registration and login
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Utility to generate JWT
const generateToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/register
// Registers a new admin user (demo: all registered users are admins)
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashed, isAdmin: true });

    const token = generateToken(user._id, user.isAdmin);
    return res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Registration failed', error: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.isAdmin);
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Login failed', error: err.message });
  }
};

module.exports = { register, login, generateToken };