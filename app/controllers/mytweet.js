'use strict';
const Tweet = require('../models/tweet');
const User = require('../models/user');

exports.home = {
  handler: function (request, reply) {
    let foundUser;
    const userEmail = request.auth.credentials.loggedInUser;
    User.findOne({email: userEmail}).then(user => {
      return foundUser = user;
    }).then(user => {
      Tweet.find({}).populate('tweeter').then(tweets => {
        tweets.sort(function (a, b) {
          if (a.date > b.date) {
            return -1;
          } if (a.date < b.date) {
            return 1;
          }
          return 0;
        });
        reply.view('home', {
          title: 'MyTweet',
          tweets: tweets,
          general: true,
          name: foundUser.firstName,
        });
      }).catch(err => {
        console.Log("Unable to get tweets from db");
        reply.redirect('/');
      });
    }).catch(err => {
      console.Log("Unable to get logged in user");
      reply.redirect('/');
    });
  },
};

exports.profilepage = {
  handler: function (request, reply) {
    let userTweets
    Tweet.find({}).populate('tweeter').then(tweets => {
      for (i = 0; i < tweets.length; i++) {
        if (user._id === tweets.tweeter) {
          userTweets.push(tweet[0]);
        }
      }
      userTweets.sort(function (a, b) {
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
        tweets: userTweets,
        general: true,
        name: 'bob',
      });
    }).catch(err => {
      console.Log("Unable to get tweets from db");
      reply.redirect('/');
    });
  }
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
  let date = new Date();
  let dd = date.getDate();
  let mm = date.getMonth() + 1;
  let hh = date.getHours();
  let min = date.getMinutes();
  const yy = date.getFullYear();

  const nums = [mm, dd, hh, min];
  for ( let i = 0; i <  nums.length; i++) {
    if (nums[i] < 10) {
      nums[i] = '0' + nums[i]
    }
  }
  return nums[1] + '/' + nums[0] + '/' + yy + ' - ' + nums[2] + ':' + nums[3];
}