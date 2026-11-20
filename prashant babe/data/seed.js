const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const Company = require('../models/Company');
const Resource = require('../models/Resource');
const seedData = require('./seedData');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/interview_prep_portal';
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing collections...');
    await User.deleteMany();
    await Question.deleteMany();
    await Quiz.deleteMany();
    await Company.deleteMany();
    await Resource.deleteMany();

    console.log('Seeding Users...');
    for (const u of seedData.users) {
      const password = u.role === 'admin' ? 'Admin@123' : 'Student@123';
      await User.create({ ...u, password });
    }

    console.log(`Seeding ${seedData.questions.length} Questions...`);
    await Question.insertMany(seedData.questions);

    console.log(`Seeding ${seedData.quizzes.length} Quizzes...`);
    await Quiz.insertMany(seedData.quizzes);

    console.log(`Seeding ${seedData.companies.length} Companies...`);
    await Company.insertMany(seedData.companies);

    console.log(`Seeding ${seedData.resources.length} Placement Resources...`);
    await Resource.insertMany(seedData.resources);

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during database seed:', err.message);
    process.exit(1);
  }
};

seedDatabase();
