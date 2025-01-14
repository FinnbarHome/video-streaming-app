const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  videoName: {
    type: String,
    required: true,
  },
  videoDescription: {
    type: String,
    required: false,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  thumbnailUrl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Video', videoSchema);
