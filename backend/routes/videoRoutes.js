const express = require('express');
const mongoose = require('mongoose');
const Video = require('../models/Video');

const router = express.Router();

/**
 * Helper function to validate ObjectId format
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Search videos by videoName
 * GET /api/videos/search?query=MySearchTerm
 */
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query; // e.g., ?query=Batman

    if (!query) {
      // If there's no query, return an empty array
      return res.status(200).json([]);
    }

    // Use a case-insensitive regex search on the "videoName" field
    const videos = await Video.find(
      { videoName: { $regex: query, $options: 'i' } },
      null, // No specific fields projection
      { limit: 50 } // Limit results to 50 for performance
    );

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

    // Validate required fields
    if (!videoName || !videoUrl || !thumbnailUrl) {
      return res
        .status(400)
        .json({ error: 'videoName, videoUrl, and thumbnailUrl are required' });
    }

    // Create and save the video
    const video = new Video({
      videoName,
      videoDescription: videoDescription || '', // Optional field
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

    if (!isValidObjectId(videoId)) {
      return res.status(400).json({ error: 'Invalid video ID format' });
    }

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
