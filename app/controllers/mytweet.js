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

exports.profilepage = {
  handler: function (request, reply) {
    let publicPage = true;
    let findEmail;
    let data = request.params.email;
    let userTweets = [];
    let foundUser;
    const loggedInUserEmail = request.auth.credentials.loggedInUser;

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


exports.newTweet = {
  handler: (request, reply) => {
    const userEmail = request.auth.credentials.loggedInUser;
    User.findOne({email: userEmail}).then(user => {
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

exports.delete = {
  handler: function (request, reply) {
    const userEmail = request.params.email;
    const data = request.payload;
    const tweetsArray = Object.keys(data);
    for(let i = 0; i < tweetsArray.length; i++) {
      let id = tweetsArray[i];
      Tweet.findOneAndRemove({ _id: id }, function(err) {
        if (err) throw err;
        console.log('Tweet deleted: ' + id);
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