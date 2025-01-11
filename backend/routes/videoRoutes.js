const express = require('express');
const Video = require('../models/Video');

const router = express.Router();

/**
 * Create a video:
 * POST /api/videos
 * body: { videoName, videoDescription, videoUrl }
 */
router.post('/', async (req, res) => {
  try {
    const { videoName, videoDescription, videoUrl } = req.body;
    if (!videoName || !videoUrl) {
      return res
        .status(400)
        .json({ error: 'videoName and videoUrl are required' });
    }
    const video = new Video({ videoName, videoDescription, videoUrl });
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
