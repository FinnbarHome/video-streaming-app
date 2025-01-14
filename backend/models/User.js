const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // no duplicate usernames
  },
  password: {
    type: String,
    required: true,
  },
  watchlist: [
    {
      videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
      addedAt: { type: Date, default: Date.now },
    },
  ],
  watchHistory: [
    {
      videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
      watchedAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
