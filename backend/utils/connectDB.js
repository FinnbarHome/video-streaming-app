// connectDB.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MONGO_URI should look like:
    // "mongodb+srv://<username>:<password>@<clusterName>.mongodb.net/<dbname>?retryWrites=true&w=majority"
    const uri = process.env.MONGO_URI;

    // Connect to MongoDB Atlas
    await mongoose.connect(uri, {

    });

    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('ERROR: MongoDB Atlas connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
