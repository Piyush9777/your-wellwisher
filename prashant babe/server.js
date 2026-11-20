const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Initialize Express application
const app = express();

// Database Connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve frontend static assets
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'PrepVault - Interview Preparation Portal API',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/mock-interview', require('./routes/mockInterviewRoutes'));
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Serve index.html for Single Page Application navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Centralized Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 PrepVault Interview Preparation Portal is Live!`);
  console.log(`📡 Local Server URL: http://localhost:${PORT}`);
  console.log(`🔑 Demo User: student@prepvault.io | Pass: Student@123`);
  console.log(`👑 Demo Admin: admin@prepvault.io   | Pass: Admin@123`);
  console.log(`====================================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection]: ${err.message}`);
  // Keep server running in development mode
});

module.exports = app;
