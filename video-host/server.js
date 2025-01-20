const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT;

console.log(`Connecting to MongoDB: ${mongoUri}`);
console.log(`Using Video Host Port: ${videoHostPort}`);

// Serve static files from the "videos" directory
app.use("/videos", express.static(path.join(__dirname, "videos")));

app.listen(PORT, () => {
  console.log(
    `Video hosting service running at http://localhost:${PORT}/videos`
  );
});
