const mongoose = require('mongoose');

const mockSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roleTarget: {
    type: String,
    required: true,
    enum: ['Software Development Engineer (SDE)', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Analyst', 'DevOps / Cloud Engineer']
  },
  experienceLevel: {
    type: String,
    enum: ['Entry Level / Fresher', 'Intermediate (1-3 yrs)', 'Senior (3+ yrs)'],
    default: 'Entry Level / Fresher'
  },
  companyTarget: {
    type: String,
    default: 'General Tech'
  },
  overallScore: {
    type: Number,
    min: 0,
    max: 100
  },
  feedbackSummary: {
    strengths: [String],
    improvements: [String],
    recommendations: [String]
  },
  metrics: {
    technicalAccuracy: Number,
    communicationClarity: Number,
    problemSolving: Number,
    confidence: Number
  },
  rounds: [{
    questionIndex: Number,
    questionText: String,
    category: String, // 'Technical', 'System Design', 'Behavioral/HR'
    userAnswer: String,
    aiFeedback: String,
    roundScore: Number,
    strengthsDetected: [String],
    improvementPointers: [String]
  }],
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MockSession', mockSessionSchema);
