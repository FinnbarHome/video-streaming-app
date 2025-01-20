const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables from .env
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is not defined in the environment variables.");
  process.exit(1);
}

// Define a function to clear the database
const clearDatabase = async () => {
  try {
    // Connect to the database
    await mongoose.connect(MONGO_URI);

    console.log("Connected to the database.");

    // Specify the video collection to clear
    const collection = mongoose.connection.db.collection("videos");

    // Count documents in the collection
    const documentCount = await collection.countDocuments();
    if (documentCount > 0) {
      console.log(
        `Found ${documentCount} documents. Clearing the collection...`
      );
      await collection.deleteMany({});
      console.log("Collection cleared.");
    } else {
      console.log("No documents found in the collection.");
    }
  } catch (error) {
    console.error("Error clearing the database:", error);
  } finally {
    // Disconnect from the database
    mongoose.disconnect();
    console.log("Disconnected from the database.");
  }
};

// Run the function
clearDatabase();
