// models/User.js - Admin user model
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    isAdmin: { type: Boolean, default: true }, // NOTE: demo default; restrict in production
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
