const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const videosDir = path.join(__dirname, "videos");

// Serve static files from the local "videos" directory (supports Range requests for streaming)
app.use(
  "/videos",
  express.static(videosDir, {
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      const ext = path.extname(filePath).toLowerCase();

      if (ext === ".png") {
        res.setHeader("Cache-Control", "public, max-age=604800"); // 7 days
      } else if (ext === ".mp4") {
        res.setHeader("Cache-Control", "public, max-age=3600"); // 1 hour
      }
    },
  })
);

app.listen(PORT, () => {
  console.log(
    `Video hosting service running at http://localhost:${PORT}/videos`
  );
});
