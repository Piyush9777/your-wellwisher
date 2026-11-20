const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['interview_experience', 'study_material', 'pyq', 'roadmap']
  },
  category: {
    type: String, // 'DSA', 'Core CS', 'Aptitude', 'System Design', 'General Placement'
    required: true
  },
  company: {
    type: String,
    default: 'General'
  },
  author: {
    name: String,
    college: String,
    currentCompany: String,
    rolePlaced: String,
    year: Number
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String
  },
  roadmapSteps: [{
    phase: String,
    weekRange: String,
    goals: [String],
    resourcesToFollow: [String]
  }],
  experienceDetails: {
    roundsCount: Number,
    ctcOffered: String,
    difficultyRating: String, // 'Easy', 'Medium', 'Hard'
    status: String, // 'Selected', 'Reached Final Round'
    verdictAdvice: String
  },
  downloadLink: {
    type: String
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resource', resourceSchema);
