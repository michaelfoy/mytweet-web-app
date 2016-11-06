'use strict';
const Tweet = require('../models/tweet');
const User = require('../models/user');

/**
 * Displays the homepage
 */
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
          user: foundUser,
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

/**
 * Displays an individual profile page,
 * if publicPage == true, a public profile is displayed
 * else, a logged-in user's own private profile
 */
exports.profilepage = {
  handler: function (request, reply) {
    let publicPage = true;
    let findEmail;
    let data = request.params.email;
    let foundUser;
    const loggedInUserEmail = request.auth.credentials.loggedInUser;

    // Check if the page belongs to logged-in user
    if (loggedInUserEmail === data) {
      publicPage = false;
      findEmail = loggedInUserEmail;
    } else {
      publicPage = true;
      findEmail = data;
    }

    User.findOne({email: findEmail}).then(user => {
      return foundUser = user;

    }).then(user => {
      return Tweet.find({tweeter: user._id})

    }).then(userTweets => {

      // Sorts a user's tweets
      userTweets.sort(function (a, b) {
        if (a.date > b.date) {
          return -1;
        }
        if (a.date < b.date) {
          return 1;
        }
        return 0;
      });

      reply.view('profilepage', {
        title: 'MyTweet Profile Page',
        tweets: userTweets,
        public: publicPage,
        user: foundUser,
      });
    }).catch(err => {
      console.Log("Unable to get logged in user tweets");
      reply.redirect('/');
    });
  },
};

/**
 * Creates a new tweet, returns to homepage
 */
exports.newTweet = {
  handler: (request, reply) => {
    let data = request.payload;
    console.log('Creating new tweet: ' + data['content']);

    // Checks that the tweet contains at least one character
    if (data['content'].length >= 1) {
      const userEmail = request.auth.credentials.loggedInUser;
      User.findOne({email: userEmail}).then(user => {
        const tweet = new Tweet(data);
        tweet.tweeter = user._id;
        tweet.date = getDate();
        return tweet.save();
      }).then(newTweet => {
        reply.redirect('/home');
      }).catch(err => {
        console.log("Internal error")
        reply.redirect('/');
      });
    } else {
      reply.redirect('/home');
    }
  },
};

exports.delete = {
  handler: function (request, reply) {
    const userEmail = request.params.email;
    const data = request.payload;
    console.log(data);
    const tweetsArray = Object.keys(data);
    console.log(tweetsArray);

    for(let i = 0; i < tweetsArray.length; i++) {
      Tweet.findByIdAndRemove(tweetsArray[i], function(err) {
        if (err) throw err;
        console.log('Tweet deleted: ' + tweetsArray[i]);
      });
    }
    reply.redirect('/profilepage/' + userEmail);
  }
};

function getDate() {
  let date = new Date();
  let dd = date.getDate();
  let mm = date.getMonth() + 1;
  let hh = date.getHours();
  let min = date.getMinutes();
  const yy = date.getFullYear();

  const nums = [mm, dd, hh, min];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] < 10) {
      nums[i] = '0' + nums[i]
    }
  }
  return nums[1] + '/' + nums[0] + '/' + yy + ' - ' + nums[2] + ':' + nums[3];
}