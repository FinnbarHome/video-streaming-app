const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// MongoDB URI from .env
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("MONGO_URI is not defined in the .env file");
  process.exit(1);
}

// API Base URL from .env
const VIDEO_HOST_PORT = process.env.VIDEO_HOST_PORT;
const apiBaseUrl = `http://localhost:${VIDEO_HOST_PORT}/videos`;

if (!apiBaseUrl) {
  console.error("API_BASE_URL is not defined in the .env file");
  process.exit(1);
}

console.log(`Connecting to MongoDB: ${MONGO_URI}`);
console.log(`Using Video Host Port: ${VIDEO_HOST_PORT}`);

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Define Video schema
const videoSchema = new mongoose.Schema({
  videoName: String,
  videoDescription: String,
  videoUrl: String,
  thumbnailUrl: String,
});

// Use the "videos" collection in the db
const Video = mongoose.model("Video", videoSchema, "videos");

// Determine the directory path dynamically
const videoDir = path.join(__dirname, "..", "video-host", "videos");
if (!fs.existsSync(videoDir)) {
  console.error(`Directory does not exist: ${videoDir}`);
  process.exit(1);
}

const seedDatabase = async () => {
  const files = fs.readdirSync(videoDir);

  const videos = files.filter((file) => file.endsWith(".mp4"));
  const images = files.filter((file) => file.endsWith(".png"));

  const entries = videos
    .map((video) => {
      const baseName = path.basename(video, ".mp4");
      const image = images.find(
        (img) => path.basename(img, ".png") === baseName
      );

      if (image) {
        const videoName = baseName.replace(/([A-Z])/g, " $1").trim();
        return {
          videoName,
          videoDescription: `Video of ${videoName.toLowerCase()}`,
          videoUrl: `${apiBaseUrl}/${video}`,
          thumbnailUrl: `${apiBaseUrl}/${image}`,
        };
      }
    })
    .filter((entry) => entry);

  try {
    const result = await Video.insertMany(entries);
    console.log(
      `Database seeded successfully. ${result.length} entries added.`
    );
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
};

// Run the seed script
seedDatabase();
