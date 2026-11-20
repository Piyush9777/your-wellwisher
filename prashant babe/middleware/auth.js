const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes requiring authentication
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Ensure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route. Please log in.'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'super_secret_jwt_prep_portal_key_2026_xyz!'
    );

    // If database is connected, fetch fresh user
    if (User && User.findById) {
      try {
        req.user = await User.findById(decoded.id);
      } catch (dbErr) {
        req.user = { _id: decoded.id, role: decoded.role || 'user' };
      }
    }
    
    if (!req.user) {
      req.user = { _id: decoded.id, role: decoded.role || 'user' };
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired session token. Please log in again.'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role '${req.user ? req.user.role : 'guest'}' is unauthorized for this action`
      });
    }
    next();
  };
};
