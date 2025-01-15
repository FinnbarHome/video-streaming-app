// connectDB.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    // Connect to MongoDB Atlas
    await mongoose.connect(uri, {});

    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('ERROR: MongoDB Atlas connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
