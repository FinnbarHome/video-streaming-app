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
  // This could point to an S3/CloudFront or other CDN URL
  videoUrl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Video', videoSchema);
