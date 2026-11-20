const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  tier: {
    type: String,
    enum: ['Product / Tier 1', 'Service / Mass IT', 'Fintech / Enterprise'],
    default: 'Service / Mass IT'
  },
  logo: {
    type: String
  },
  accentColor: {
    type: String,
    default: '#4F46E5'
  },
  about: {
    type: String,
    required: true
  },
  hiringProcess: [{
    roundNumber: Number,
    roundName: String,
    mode: String, // Online test, Technical interview, HR interview
    duration: String,
    details: String
  }],
  syllabusTopics: [{
    section: String,
    topics: [String]
  }],
  keyFocusAreas: [String],
  dosAndDonts: {
    dos: [String],
    donts: [String]
  },
  frequentlyAskedQuestions: [{
    question: String,
    category: String,
    difficulty: String,
    hint: String
  }],
  cutoffAndEligibility: {
    minCgpa: Number,
    backlogsAllowed: Number,
    streams: [String]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Company', companySchema);
