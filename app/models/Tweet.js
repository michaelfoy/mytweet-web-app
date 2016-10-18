const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
  content: String,
  date: String,
  tweeter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Donation = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;