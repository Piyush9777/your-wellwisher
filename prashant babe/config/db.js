const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/interview_prep_portal', {
      serverSelectionTimeoutMS: 4000
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB Warning]: Could not connect to MongoDB (${error.message}).`);
    console.warn(`[Fallback Notice]: Server is operating with in-memory persistence fallback for offline or standalone operation.`);
    return false;
  }
};

module.exports = connectDB;
