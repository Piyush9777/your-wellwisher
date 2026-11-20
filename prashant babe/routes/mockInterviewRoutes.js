const express = require('express');
const router = express.Router();
const MockSession = require('../models/MockSession');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Role-based AI question prompts
const roleQuestionBanks = {
  'Software Development Engineer (SDE)': [
    {
      question: "Walk me through how you would optimize an algorithm that currently runs in O(N^2) time to O(N) or O(N log N). Share a real example.",
      category: "Technical / Algorithms",
      keywords: ["hash map", "two pointers", "binary search", "trade-off", "space complexity", "sorting"]
    },
    {
      question: "How do you ensure thread-safety when multiple threads modify a shared resource in memory?",
      category: "Concurrency & OS",
      keywords: ["mutex", "semaphore", "atomic", "locks", "deadlock", "race condition", "synchronized"]
    },
    {
      question: "Describe a complex bug you encountered in production or during a project. How did you isolate and resolve it?",
      category: "Behavioral / Problem Solving",
      keywords: ["reproduce", "logs", "debugger", "root cause", "testing", "monitoring", "profiler"]
    }
  ],
  'Frontend Developer': [
    {
      question: "Explain how the Browser Critical Rendering Path works and what techniques you use to achieve sub-second LCP (Largest Contentful Paint).",
      category: "Web Performance",
      keywords: ["dom", "cssom", "render tree", "lazy loading", "code splitting", "caching", "layout"]
    },
    {
      question: "How does the JavaScript Event Loop handle microtasks vs macrotasks? Provide an example with Promises and setTimeout.",
      category: "Core JavaScript",
      keywords: ["call stack", "microtask queue", "macrotask", "promise", "settimeout", "non-blocking"]
    },
    {
      question: "Tell me about a time you had to make a design trade-off between user experience and technical feasibility.",
      category: "Behavioral",
      keywords: ["user experience", "performance", "trade-off", "stakeholders", "compromise", "accessibility"]
    }
  ],
  'Full Stack Developer': [
    {
      question: "How do you design a secure RESTful API that handles authentication, authorization, and rate limiting?",
      category: "System Design & Security",
      keywords: ["jwt", "oauth", "middleware", "token", "rate limit", "https", "cors", "hash"]
    },
    {
      question: "Compare SQL relational databases vs NoSQL document stores. Under what circumstances would you choose MongoDB over PostgreSQL?",
      category: "Database Architecture",
      keywords: ["acid", "schema", "flexible", "horizontal scale", "indexes", "transactions", "json"]
    },
    {
      question: "Describe a situation where you had to quickly learn a new framework or tool to meet a project deliverable.",
      category: "Behavioral / Growth Mindset",
      keywords: ["documentation", "hands-on", "prototype", "mentor", "delivery", "fast learning"]
    }
  ]
};

// @route   POST /api/mock-interview/start
// @desc    Initialize a mock interview session and return first question
router.post('/start', protect, async (req, res, next) => {
  try {
    const { roleTarget = 'Software Development Engineer (SDE)', experienceLevel = 'Entry Level / Fresher', companyTarget = 'General Tech' } = req.body;

    const questionsList = roleQuestionBanks[roleTarget] || roleQuestionBanks['Software Development Engineer (SDE)'];

    const sessionData = {
      sessionId: 'mock_' + Date.now(),
      roleTarget,
      experienceLevel,
      companyTarget,
      totalQuestions: questionsList.length,
      currentQuestionIndex: 0,
      currentQuestion: questionsList[0]
    };

    res.status(200).json({
      success: true,
      message: 'Mock interview session created successfully',
      session: sessionData
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/mock-interview/evaluate
// @desc    Evaluate candidate answer using AI NLP heuristics and return round feedback
router.post('/evaluate', protect, async (req, res, next) => {
  try {
    const { roleTarget, questionIndex = 0, questionText, userAnswer } = req.body;

    if (!userAnswer || userAnswer.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a detailed verbal or written answer for evaluation.'
      });
    }

    const answerLower = userAnswer.toLowerCase();
    const wordCount = userAnswer.trim().split(/\s+/).length;

    // AI Evaluation heuristics
    const questionsList = roleQuestionBanks[roleTarget] || roleQuestionBanks['Software Development Engineer (SDE)'];
    const currentQ = questionsList[questionIndex] || { keywords: ["algorithm", "system", "performance"] };

    // Keyword relevance match
    const matchedKeywords = currentQ.keywords.filter(kw => answerLower.includes(kw));
    const keywordRatio = matchedKeywords.length / Math.max(currentQ.keywords.length, 1);

    // Scoring dimensions
    let technicalAccuracy = Math.min(Math.round(55 + (keywordRatio * 40)), 96);
    let communicationClarity = wordCount >= 40 && wordCount <= 250 ? 88 : wordCount < 40 ? 60 : 75;
    let confidence = answerLower.includes('definitely') || answerLower.includes('implemented') || answerLower.includes('specifically') || answerLower.includes('result') ? 85 : 72;
    let problemSolving = matchedKeywords.length >= 2 ? 86 : 70;

    const roundScore = Math.round((technicalAccuracy * 0.4) + (communicationClarity * 0.3) + (problemSolving * 0.3));

    // Construct constructive AI critique
    const strengths = [];
    const improvements = [];

    if (matchedKeywords.length > 0) {
      strengths.push(`Identified key concepts: ${matchedKeywords.join(', ')}.`);
    }
    if (wordCount >= 45) {
      strengths.push("Good depth and explanation of technical thought process.");
    }
    if (keywordRatio < 0.5) {
      improvements.push(`Include more technical depth: consider mentioning ${currentQ.keywords.slice(0, 3).join(', ')}.`);
    }
    if (wordCount < 40) {
      improvements.push("Elaborate further using concrete metrics or step-by-step reasoning.");
    }

    const aiFeedback = roundScore >= 80
      ? `Strong answer! You articulated the core principles clearly and demonstrated practical familiarity with ${roleTarget} best practices.`
      : `Solid attempt. You established the initial idea, but framing your answer with specific examples and technical trade-offs will make your response stand out.`;

    const isLastQuestion = questionIndex >= questionsList.length - 1;
    const nextQuestion = !isLastQuestion ? questionsList[questionIndex + 1] : null;

    res.status(200).json({
      success: true,
      roundScore,
      metrics: {
        technicalAccuracy,
        communicationClarity,
        problemSolving,
        confidence
      },
      strengths,
      improvements,
      aiFeedback,
      isLastQuestion,
      nextQuestionIndex: questionIndex + 1,
      nextQuestion
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/mock-interview/finish
// @desc    Generate final interview report and award score
router.post('/finish', protect, async (req, res, next) => {
  try {
    const { roleTarget, averageScore = 82 } = req.body;

    // Update user stats
    try {
      const user = await User.findById(req.user._id);
      if (user) {
        user.stats.mockInterviewsCompleted += 1;
        user.stats.totalPoints += 50;
        user.updateReadinessScore();
        await user.save();
      }
    } catch (e) {}

    const report = {
      sessionDate: new Date(),
      roleTarget,
      overallScore: averageScore,
      verdict: averageScore >= 75 ? "Hire / Recommended for Final Round" : "Needs Practice",
      summary: "You demonstrated solid technical fundamentals and structured communication. Focus on quantifying your project outcomes to excel in top product company interviews.",
      keyCompetencies: [
        { name: "Technical Knowledge", score: Math.min(averageScore + 4, 98) },
        { name: "Communication & STAR", score: averageScore },
        { name: "Problem Decomposition", score: Math.max(averageScore - 5, 65) },
        { name: "Culture Fit & Confidence", score: 85 }
      ],
      nextSteps: [
        "Review dynamic programming and sliding window patterns",
        "Practice answering behavioral questions within a strict 2-minute timer",
        "Deepen system design concepts like caching strategies and indexing"
      ]
    };

    res.status(200).json({
      success: true,
      report
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
