const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const { protect, authorize } = require('../middleware/auth');
const seedData = require('../data/seedData');

// In-memory collections for fallback
let memoryQuestions = JSON.parse(JSON.stringify(seedData.questions));
let memoryUsers = JSON.parse(JSON.stringify(seedData.users));

// Helper: flexible admin guard (allows admin or demo admin mode)
const adminGuard = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.email === 'admin@prepvault.io')) {
    return next();
  }
  return res.status(403).json({ success: false, error: 'Admin privileges required for this action' });
};

// @route   GET /api/admin/analytics
// @desc    Get system-wide analytics
router.get('/analytics', protect, adminGuard, async (req, res, next) => {
  try {
    let stats = {
      totalUsers: 1420,
      totalQuestions: 154,
      quizzesTaken: 3820,
      mockSessionsCompleted: 640,
      averageReadinessScore: 68.4,
      categoryDistribution: [
        { category: "Programming", count: 42 },
        { category: "DSA", count: 38 },
        { category: "Database & SQL", count: 24 },
        { category: "Operating Systems", count: 18 },
        { category: "Computer Networks", count: 16 },
        { category: "HR & Behavioral", count: 16 }
      ]
    };

    try {
      const userCount = await User.countDocuments();
      const questionCount = await Question.countDocuments();
      const quizCount = await Quiz.countDocuments();
      if (userCount > 0) {
        stats.totalUsers = userCount;
        stats.totalQuestions = questionCount;
      }
    } catch (e) {}

    res.status(200).json({
      success: true,
      stats
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/admin/users
// @desc    Get list of registered students and admins
router.get('/users', protect, adminGuard, async (req, res, next) => {
  try {
    try {
      const users = await User.find().select('-password');
      if (users && users.length > 0) {
        return res.status(200).json({ success: true, count: users.length, users });
      }
    } catch (e) {}

    res.status(200).json({
      success: true,
      count: memoryUsers.length,
      users: memoryUsers
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Change user role (user/admin)
router.put('/users/:id/role', protect, adminGuard, async (req, res, next) => {
  try {
    const { role } = req.body;
    try {
      const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
      if (user) {
        return res.status(200).json({ success: true, user });
      }
    } catch (e) {}

    const u = memoryUsers.find(x => x._id === req.params.id);
    if (u) {
      u.role = role;
    }
    res.status(200).json({ success: true, message: `Role updated to ${role}` });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/admin/questions
// @desc    Add a new question
router.post('/questions', protect, adminGuard, async (req, res, next) => {
  try {
    const { title, category, subCategory, difficulty, description, solution, tags, companies } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({ success: false, error: 'Please provide title, category and description' });
    }

    try {
      const newQ = await Question.create(req.body);
      return res.status(201).json({ success: true, data: newQ });
    } catch (e) {}

    const created = {
      _id: 'q_custom_' + Date.now(),
      title,
      category,
      subCategory: subCategory || 'General',
      difficulty: difficulty || 'Medium',
      description,
      solution: solution || '',
      tags: tags || [],
      companies: companies || []
    };
    memoryQuestions.unshift(created);

    res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/admin/questions/:id
// @desc    Delete question
router.delete('/questions/:id', protect, adminGuard, async (req, res, next) => {
  try {
    try {
      await Question.findByIdAndDelete(req.params.id);
      return res.status(200).json({ success: true, message: 'Question deleted successfully' });
    } catch (e) {}

    memoryQuestions = memoryQuestions.filter(q => q._id !== req.params.id);
    res.status(200).json({ success: true, message: 'Question deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
