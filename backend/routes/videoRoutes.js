// routes/videoRoutes.js
const express = require('express');
const Video = require('../models/Video');

const router = express.Router();

/**
 * Search videos by videoName
 * GET /api/videos/search?query=MySearchTerm
 */
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query; // e.g., ?query=Batman

    if (!query) {
      // If there's no query, return an empty array or all videos
      return res.status(200).json([]);
    }

    // Use a case-insensitive regex search on the "videoName" field
    const videos = await Video.find({
      videoName: { $regex: query, $options: 'i' },
    });

    return res.status(200).json(videos);
  } catch (err) {
    console.error('Video Search Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


/**
 * Create a video:
 * POST /api/videos
 * body: { videoName, videoDescription, videoUrl, thumbnailUrl }
 */
router.post('/', async (req, res) => {
  try {
    const { videoName, videoDescription, videoUrl, thumbnailUrl } = req.body;
    if (!videoName || !videoUrl || !thumbnailUrl) {
      return res
        .status(400)
        .json({ error: 'videoName, videoUrl, and thumbnailUrl are required' });
    }
    const video = new Video({
      videoName,
      videoDescription,
      videoUrl,
      thumbnailUrl,
    });
    await video.save();
    return res.status(201).json({ message: 'Video created', video });
  } catch (err) {
    console.error('Create Video Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get all videos:
 * GET /api/videos
 */
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find({});
    return res.status(200).json(videos);
  } catch (err) {
    console.error('Get Videos Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get video by ID:
 * GET /api/videos/:videoId
 */
router.get('/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    return res.status(200).json(video);
  } catch (err) {
    console.error('Get Video Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;
