const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a question title'],
    trim: true
  },
  slug: {
    type: String,
    lowercase: true,
    index: true
  },
  description: {
    type: String,
    required: [true, 'Please add question description']
  },
  category: {
    type: String,
    required: true,
    enum: ['programming', 'dsa', 'sql', 'os', 'cn', 'hr', 'aptitude']
  },
  subCategory: {
    type: String, // e.g., 'C', 'C++', 'Java', 'Python', 'JavaScript', 'Trees', 'Normalization', 'Processes'
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  tags: [{
    type: String
  }],
  companies: [{
    type: String // e.g. 'Amazon', 'Google', 'TCS', 'Infosys'
  }],
  starterCode: {
    c: String,
    cpp: String,
    java: String,
    python: String,
    javascript: String,
    sql: String
  },
  solution: {
    type: String
  },
  explanation: {
    type: String
  },
  testCases: [{
    input: String,
    expectedOutput: String,
    explanation: String,
    isHidden: { type: Boolean, default: false }
  }],
  // For HR & Behavioral questions
  hrGuidance: {
    starFramework: {
      situation: String,
      task: String,
      action: String,
      result: String
    },
    sampleAnswer: String,
    interviewerTips: [String],
    dosAndDonts: {
      dos: [String],
      donts: [String]
    }
  },
  upvotes: {
    type: Number,
    default: 0
  },
  submissionCount: {
    type: Number,
    default: 0
  },
  successRate: {
    type: Number,
    default: 75
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);
