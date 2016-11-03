const User = require('../models/user');
const Admin = require('../models/admin');

exports.index = {
  auth: false,
  handler: (request, reply) => {
    reply.view('main', {title: 'Welcome to MyTweet'});
  },
};

exports.signup = {
  auth: false,
  handler: (request, reply) => {
    reply.view('signup', {title: 'Sign up for MyTweet'});
  },
};

exports.login = {
  auth: false,
  handler: (request, reply) => {
    reply.view('login', {title: 'Log in to MyTweet'});
  },
};

exports.authenticate = {
  auth: false,
  handler: function (request, reply) {
    const user = request.payload;
    if (user.password === "adminsecret") {
      Admin.findOne({email: user.email}).then(foundUser => {
          request.cookieAuth.set({
            loggedIn: true,
            loggedInUser: user.email,
            admin: true,
          });
          reply.redirect('/admin');
      }).catch(err => {
        reply.redirect('/');
        console.log("Unable to find admin account")
      });

    } else {
        User.findOne({email: user.email}).then(foundUser => {
          if (foundUser && foundUser.password === user.password) {
            request.cookieAuth.set({
              loggedIn: true,
              loggedInUser: user.email,
            });
            reply.redirect('/home');
          } else {
            reply.redirect('/signup');
            console.log("Invalid password")
          }
        }).catch(err => {
        reply.redirect('/');
          console.log("Unable to find user account")
        });
    };
  },
};

exports.logout = {
  auth: false,
  handler: function (request, reply) {
    request.cookieAuth.clear();
    reply.redirect('/');
  },
};

exports.register = {
  auth: false,
  handler: function (request, reply) {
    const user = new User(request.payload);
    user.save().then(newUser => {
      reply.redirect('/login');
    }).catch(err => {
      reply.redirect('/');
    });
  },
};