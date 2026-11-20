const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [60, 'Name cannot exceed 60 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
  },
  college: {
    type: String,
    default: 'National Institute of Technology'
  },
  graduationYear: {
    type: Number,
    default: 2026
  },
  targetRole: {
    type: String,
    default: 'Full Stack SDE'
  },
  targetCompanies: [{
    type: String
  }],
  readinessScore: {
    type: Number,
    default: 35,
    min: 0,
    max: 100
  },
  stats: {
    technicalSolved: { type: Number, default: 0 },
    aptitudeTestsTaken: { type: Number, default: 0 },
    mockInterviewsCompleted: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 1 },
    totalPoints: { type: Number, default: 100 },
    lastActiveDate: { type: Date, default: Date.now }
  },
  solvedQuestions: [{
    questionId: { type: String },
    solvedAt: { type: Date, default: Date.now },
    language: { type: String, default: 'javascript' }
  }],
  bookmarks: [{
    type: String
  }],
  completedQuizzes: [{
    quizId: { type: String },
    title: { type: String },
    score: { type: Number },
    total: { type: Number },
    percentage: { type: Number },
    completedAt: { type: Date, default: Date.now }
  }],
  resumeData: {
    personal: {
      fullName: String,
      email: String,
      phone: String,
      linkedin: String,
      github: String,
      portfolio: String,
      summary: String
    },
    education: [{
      degree: String,
      institution: String,
      year: String,
      grade: String
    }],
    experience: [{
      title: String,
      company: String,
      duration: String,
      bullets: [String]
    }],
    projects: [{
      title: String,
      technologies: String,
      link: String,
      description: String
    }],
    skills: {
      languages: [String],
      frameworks: [String],
      tools: [String],
      coursework: [String]
    }
  },
  certificates: [{
    title: String,
    category: String,
    issueDate: { type: Date, default: Date.now },
    verificationCode: String,
    score: Number
  }]
}, {
  timestamps: true
});

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to verify password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to sign JWT
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || 'super_secret_jwt_prep_portal_key_2026_xyz!',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Dynamic readiness calculation
userSchema.methods.updateReadinessScore = function () {
  const techScore = Math.min(this.stats.technicalSolved * 3, 40);
  const aptScore = Math.min(this.stats.aptitudeTestsTaken * 8, 30);
  const mockScore = Math.min(this.stats.mockInterviewsCompleted * 10, 30);
  this.readinessScore = Math.min(Math.round(techScore + aptScore + mockScore), 100);
  return this.readinessScore;
};

module.exports = mongoose.model('User', userSchema);
