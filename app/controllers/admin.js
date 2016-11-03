'use strict';
const Tweet = require('../models/tweet');
const User = require('../models/user');

exports.home = {
  handler: function (request, reply) {
    let users;
    User.find({}).then(foundUsers => {
      users = foundUsers;
      reply.view('adminhome', {
        title: 'Administrator',
        users: users,
      });
    }).catch(err => {
      console.Log("Unable to get users from db");
      reply.redirect('/');
    });
  }
};

exports.deleteuser = {
  handler: function (request, reply) {
    let nothing;
    const data = request.payload;
    const usersArray = Object.keys(data);

    for (let i = 0; i < usersArray.length; i++) {

      User.findOne({ _id: usersArray[i] }, function(err, user) {
        user.remove();
        console.log('User deleted: ' + usersArray[i]);
      }).catch(err => {
        console.Log("Unable to get users from db");
        return null;
      }).then( nothing => {
        Tweet.find({tweeter: usersArray[i]}, function (err, userTweets) {
          userTweets.forEach(function (tweet) {
            tweet.remove();
            return null;
          });
        }).then(nothing => {
          reply.redirect('/admin');
        }).catch(err => {
          console.Log("Unable to get user tweets from db");
        });
      });
    }
  },
};

exports.deletetweets = {
  handler: function (request, reply) {
    const data = request.payload;
    const tweetsArray = Object.keys(data);
    console.log(tweetsArray);

    for(let i = 0; i < tweetsArray.length; i++) {
      Tweet.findByIdAndRemove(tweetsArray[i], function(err) {
        if (err) throw err;
        console.log('Tweet deleted: ' + tweetsArray[i]);
      });
    }
    reply.redirect('/admin');
  },
};

exports.register = {
  handler: function (request, reply) {
    const user = new User(request.payload);
    user.save().then(newUser => {
      reply.redirect('/admin');
    }).catch(err => {
      reply.redirect('/');

    });
  },
};

exports.selectUser = {
  handler: function (request, reply) {
    let userId = request.payload['user'];
    let users;
    let tweets;

    if (userId == null) {
      reply.redirect('/admin');
    } else {

      Tweet.find({tweeter: userId}, function (err, userTweets) {
        return userTweets;

      }).then( userTweets => {

        User.find({}).then(foundUsers => {
          users = foundUsers;
          tweets = userTweets;
          reply.view('adminhome', {
            title: 'Administrator',
            users: users,
            tweets: tweets,
          });
        }).catch(err => {
          console.log('Unable to get users from db');
          reply.redirect('/admin');
        })
      }).catch(err => {
        console.log('Unable to get tweets for user: ' + userId);
        reply.redirect('/admin');
      });
    }
  }
};