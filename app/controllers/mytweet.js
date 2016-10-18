'use strict';
const Tweet = require('../models/tweet');
const User = require('../models/user');

exports.home = {
  handler: (request, reply) => {
    reply.view('home', { title: 'MyTweet' });
  },
};

exports.newTweet = {
  handler: (request, reply) => {
    const userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).then(user => {
      let data = request.payload;
      const tweet = new Tweet(data);
      tweet.tweeter = user._id;
      tweet.date = 'datePlaceholder'
      return tweet.save();
    }).then(newTweet => {
      reply.redirect('/home');
    }).catch(err => {
      reply.redirect('/');
    });
  },
};
