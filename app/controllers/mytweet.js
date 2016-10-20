'use strict';
const Tweet = require('../models/tweet');
const User = require('../models/user');

exports.home = {
  handler: function (request, reply) {
    Tweet.find({}).populate('tweeter').then(tweets => {
      tweets.sort(function (a, b) {
        if (a.date > b.date) {
          return -1;
        }
        if (a.date < b.date) {
          return 1;
        }
        return 0;
      });
      reply.view('home', {
        title: 'MyTweet',
        tweets: tweets,
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.newTweet = {
  handler: (request, reply) => {
    const userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).then(user => {
      let data = request.payload;
      const tweet = new Tweet(data);
      tweet.tweeter = user._id;
      tweet.date = getDate();
      return tweet.save();
    }).then(newTweet => {
      reply.redirect('/home');
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

function getDate() {
  let date = new Date()
  let dd = date.getDay() + 16;
  let mm = date.getMonth() + 1;
  let hh = date.getHours();
  let min = date.getMinutes();
  const yy = date.getFullYear();

  const nums = [mm, dd, hh, min]
  for ( let i = 0; i <  nums.length; i++) {
    if (nums[i] < 10) {
      nums[i] = '0' + nums[i]
    }
  }
  const dateStr = nums[2] + ':' + nums[3] + ' - ' + nums[1] + '/' + nums[0] + '/' + yy;
  return dateStr;
}
