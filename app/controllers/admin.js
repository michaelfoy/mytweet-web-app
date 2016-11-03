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
    const data = request.payload;
    const usersArray = Object.keys(data);

    for (let i = 0; i < usersArray.length; i++) {

      User.findOne({ _id: usersArray[i] }, function(err, user) {
        user.remove();
        console.log('User deleted: ' + usersArray[i]);
      }).catch(err => {
        console.Log("Unable to get users from db");
        reply.redirect('/admin');
      });


      Tweet.find({ tweeter: usersArray[i]}, function(err, userTweets) {
        userTweets.forEach(function(tweet) {
          tweet.remove();
        });
      }).catch(err => {
        console.Log("Unable to get user tweets from db");
        reply.redirect('/admin');
      });
    };
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