const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const seedData = require('../data/seedData');

// In-memory mock store for when MongoDB is disconnected
let memoryUsers = JSON.parse(JSON.stringify(seedData.users));

// Helper: send token response
const sendTokenResponse = (user, statusCode, res) => {
  let token;
  if (typeof user.getSignedJwtToken === 'function') {
    token = user.getSignedJwtToken();
  } else {
    const jwt = require('jsonwebtoken');
    token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'super_secret_jwt_prep_portal_key_2026_xyz!',
      { expiresIn: '7d' }
    );
  }

  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.password;

  res.status(statusCode).json({
    success: true,
    token,
    user: userObj
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, college, graduationYear, targetRole, targetCompanies } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide name, email and password' });
    }

    try {
      // Try MongoDB
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ success: false, error: 'Email already registered' });
      }

      user = await User.create({
        name,
        email,
        password,
        college: college || 'University of Engineering & Technology',
        graduationYear: graduationYear || 2026,
        targetRole: targetRole || 'Full Stack SDE',
        targetCompanies: targetCompanies || ['Amazon', 'TCS', 'Accenture'],
        readinessScore: 35
      });

      sendTokenResponse(user, 201, res);
    } catch (dbErr) {
      // In-Memory Fallback
      const existing = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ success: false, error: 'Email already registered' });
      }

      const newUser = {
        _id: 'usr_' + Date.now(),
        name,
        email,
        role: 'user',
        college: college || 'University of Engineering & Technology',
        graduationYear: graduationYear || 2026,
        targetRole: targetRole || 'Full Stack SDE',
        targetCompanies: targetCompanies || ['Amazon', 'TCS', 'Accenture'],
        readinessScore: 35,
        stats: { technicalSolved: 0, aptitudeTestsTaken: 0, mockInterviewsCompleted: 0, currentStreak: 1, totalPoints: 100 },
        bookmarks: [],
        solvedQuestions: []
      };
      memoryUsers.push(newUser);
      sendTokenResponse(newUser, 201, res);
    }
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/auth/login
// @desc    Login user & return JWT token
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    try {
      // Check MongoDB
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid email or password' });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, error: 'Invalid email or password' });
      }

      sendTokenResponse(user, 200, res);
    } catch (dbErr) {
      // Check in-memory store
      const user = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid email or password' });
      }
      sendTokenResponse(user, 200, res);
    }
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
router.get('/me', protect, async (req, res, next) => {
  try {
    try {
      const user = await User.findById(req.user._id);
      if (user) {
        return res.status(200).json({ success: true, user });
      }
    } catch (e) {}

    // Fallback in-memory
    const memUser = memoryUsers.find(u => u._id === req.user._id || u.email === req.user.email) || req.user;
    res.status(200).json({
      success: true,
      user: memUser
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile details
router.put('/profile', protect, async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      college: req.body.college,
      graduationYear: req.body.graduationYear,
      targetRole: req.body.targetRole,
      targetCompanies: req.body.targetCompanies,
      avatar: req.body.avatar
    };

    // Remove undefined
    Object.keys(fieldsToUpdate).forEach(key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]);

    try {
      const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, { new: true, runValidators: true });
      if (user) {
        return res.status(200).json({ success: true, user });
      }
    } catch (e) {}

    // Fallback update
    let user = memoryUsers.find(u => u._id === req.user._id);
    if (user) {
      Object.assign(user, fieldsToUpdate);
    } else {
      user = { ...req.user, ...fieldsToUpdate };
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
router.post('/logout', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
});

module.exports = router;
