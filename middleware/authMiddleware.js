// middleware/authMiddleware.js - JWT verification for admin routes
const jwt = require('jsonwebtoken');

// Verifies JWT token and ensures user is admin
const verifyAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.isAdmin) {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    req.user = decoded; // { id, isAdmin, iat, exp }
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

module.exports = { verifyAdmin };
