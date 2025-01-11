const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Video = require('../models/Video');

const router = express.Router();

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

    // Check for existing user
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
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
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare password
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return res.status(200).json({
      message: 'Login successful',
      userId: user._id,
      username: user.username,
    });
  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
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

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Verify the video
    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ error: 'Video not found' });

    // Check if already in watchlist
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
 * Add a video to watch history:
 * POST /api/users/:userId/history
 * body: { videoId }
 */
router.post('/:userId/history', async (req, res) => {
  try {
    const { userId } = req.params;
    const { videoId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Verify the video
    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ error: 'Video not found' });

    user.watchHistory.push({ videoId });
    await user.save();

    return res.status(200).json({
      message: 'Video added to watch history',
      user,
    });
  } catch (err) {
    console.error('Watch History Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
