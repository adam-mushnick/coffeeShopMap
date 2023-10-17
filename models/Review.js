const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  author: {
    //points to User schema model
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  coffeeShop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CoffeeShop',
    required: true,
  },
});

module.exports =
  mongoose.models.Review || mongoose.model('Review', ReviewSchema);
