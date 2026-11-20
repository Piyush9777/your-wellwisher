const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activityType: {
    type: String,
    required: true,
    enum: ['solved_question', 'attempted_quiz', 'completed_mock', 'earned_badge', 'updated_resume', 'daily_challenge']
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  scoreOrPoints: {
    type: Number,
    default: 10
  },
  meta: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Activity', activitySchema);
