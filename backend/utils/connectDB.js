const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        await mongoose.connect(uri, {
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("ERROR: MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
