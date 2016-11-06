'use strict'

const mongoose = require('mongoose');

/**
 * Model for tweet object
 */
const tweetSchema = mongoose.Schema({
  content: String,
  date: String,
  tweeter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;