const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../models/User');
const Video = require('../models/Video');

const SECRET_KEY = process.env.JWT_SECRET || 'somefallbacksecret';

const router = express.Router();

/**
 * Helper function to validate ObjectId format
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Register a new user:
 * POST /api/users/register
 */
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({
      message: 'User registered successfully',
      userId: newUser._id,
      username: newUser.username,
    });
  } catch (err) {
    console.error('Register Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Login:
 * POST /api/users/login
 */
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Login Error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!user) {
      return res
        .status(401)
        .json({ error: info?.message || 'Invalid credentials' });
    }

    const payload = {
      userId: user._id,
      username: user.username,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });

    return res.json({
      message: 'Login successful',
      token,
      userId: user._id,
      username: user.username,
    });
  })(req, res, next);
});

/**
 * Add a video to watchlist:
 * POST /api/users/:userId/watchlist
 * body: { videoId }
 */
router.post('/:userId/watchlist', async (req, res) => {
  try {
    const { userId } = req.params;
    const { videoId } = req.body;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ error: 'Video not found' });

    const alreadyInList = user.watchlist.some(
      (item) => item.videoId.toString() === videoId
    );
    if (alreadyInList) {
      return res.status(400).json({ error: 'Video already in watchlist' });
    }

    user.watchlist.push({ videoId });
    await user.save();

    return res.status(200).json({
      message: 'Video added to watchlist',
      user,
    });
  } catch (err) {
    console.error('Watchlist Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get the user's watchlist:
 * GET /api/users/:userId/watchlist
 */
router.get('/:userId/watchlist', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const user = await User.findById(userId).populate('watchlist.videoId');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const videos = user.watchlist.map((item) => item.videoId);
    return res.status(200).json(videos);
  } catch (err) {
    console.error('Get Watchlist Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get the user's watch history:
 * GET /api/users/:userId/history
 */
router.get('/:userId/history', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const user = await User.findById(userId).populate('watchHistory.videoId');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const videos = user.watchHistory.map((item) => item.videoId);
    return res.status(200).json(videos);
  } catch (err) {
    console.error('Get History Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Remove a video from watchlist:
 * DELETE /api/users/:userId/watchlist/:videoId
 */
router.delete('/:userId/watchlist/:videoId', async (req, res) => {
  try {
    const { userId, videoId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.watchlist = user.watchlist.filter(
      (item) => item.videoId.toString() !== videoId
    );

    await user.save();
    return res
      .status(200)
      .json({ message: 'Video removed from watchlist', user });
  } catch (err) {
    console.error('Remove from Watchlist Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Clear watch history:
 * DELETE /api/users/:userId/history
 */
router.delete('/:userId/history', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.watchHistory = [];
    await user.save();

    return res.status(200).json({ message: 'Watch history cleared', user });
  } catch (err) {
    console.error('Clear History Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Add a video to watch history:
 * POST /api/users/:userId/history
 * body: { videoId }
 */
router.post('/:userId/history', async (req, res) => {
  try {
    const { userId } = req.params;
    const { videoId } = req.body;

    // Validate userId
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    // Fetch user and video
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    user.watchHistory.push({ videoId });
    await user.save();

    return res.status(200).json({
      message: 'Video added to watch history',
      user,
    });
  } catch (err) {
    console.error('Add to History Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
