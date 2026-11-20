const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const seedData = require('../data/seedData');

let memoryQuizzes = JSON.parse(JSON.stringify(seedData.quizzes));

// @route   GET /api/quizzes
// @desc    Get all aptitude quizzes and mock tests
router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query;
    try {
      const query = category && category !== 'all' ? { category } : {};
      const quizzes = await Quiz.find(query);
      if (quizzes && quizzes.length > 0) {
        return res.status(200).json({ success: true, count: quizzes.length, data: quizzes });
      }
    } catch (e) {}

    // In-memory fallback
    let results = memoryQuizzes;
    if (category && category !== 'all') {
      results = results.filter(q => q.category === category);
    }
    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/quizzes/:id
// @desc    Get single quiz with questions
router.get('/:id', async (req, res, next) => {
  try {
    try {
      const quiz = await Quiz.findById(req.params.id);
      if (quiz) {
        return res.status(200).json({ success: true, data: quiz });
      }
    } catch (e) {}

    const quiz = memoryQuizzes.find(q => q._id === req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, error: 'Quiz not found' });
    }
    res.status(200).json({ success: true, data: quiz });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/quizzes/:id/submit
// @desc    Submit user answers, calculate score, provide formula breakdown & update readiness
router.post('/:id/submit', protect, async (req, res, next) => {
  try {
    const { answers, timeTakenSeconds = 0 } = req.body; // { questionIndex: chosenOptionIndex }
    const quizId = req.params.id;

    const quiz = memoryQuizzes.find(q => q._id === quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, error: 'Quiz not found' });
    }

    let correctCount = 0;
    const review = quiz.questions.map((q, idx) => {
      const chosen = answers ? answers[idx] : null;
      const isCorrect = chosen !== null && Number(chosen) === q.correctAnswer;
      if (isCorrect) correctCount++;
      return {
        questionIndex: idx,
        questionText: q.questionText,
        options: q.options,
        userAnswer: chosen,
        correctAnswer: q.correctAnswer,
        isCorrect,
        formulaUsed: q.formulaUsed,
        explanation: q.explanation
      };
    });

    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = percentage >= quiz.passingPercentage;
    const pointsEarned = correctCount * 15;

    // Update user stats
    try {
      const user = await User.findById(req.user._id);
      if (user) {
        user.stats.aptitudeTestsTaken += 1;
        user.stats.totalPoints += pointsEarned;
        user.completedQuizzes.push({
          quizId,
          title: quiz.title,
          score: correctCount,
          total: totalQuestions,
          percentage,
          completedAt: new Date()
        });
        user.updateReadinessScore();
        await user.save();
      }
    } catch (e) {}

    res.status(200).json({
      success: true,
      quizTitle: quiz.title,
      totalQuestions,
      correctCount,
      percentage,
      passed,
      timeTakenSeconds,
      pointsEarned,
      review
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
