const mongoose = require('mongoose');

const quizItemSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: Number, // 0, 1, 2, or 3
    required: true
  },
  explanation: {
    type: String
  },
  formulaUsed: {
    type: String
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide quiz title'],
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['quantitative', 'logical', 'verbal', 'company_mock', 'full_simulation']
  },
  companyTarget: {
    type: String,
    default: 'General'
  },
  durationMinutes: {
    type: Number,
    required: true,
    default: 20
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  passingPercentage: {
    type: Number,
    default: 60
  },
  questions: [quizItemSchema],
  totalAttempts: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 65
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);
