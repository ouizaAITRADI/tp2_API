const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  photos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Photo'
  }],
  created_at: {
    type: Date,
    default: Date.now
  }
});

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;