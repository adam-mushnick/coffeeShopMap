const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  coordinates: [
    {
      longitude: {
        type: Number,
        required: false,
      },
      latitude: {
        type: Number,
        required: false,
      },
    },
  ],
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: false,
  },
  author: {
    //points to User schema model
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
});

module.exports = mongoose.models.Post || mongoose.model('Post', PostSchema);
