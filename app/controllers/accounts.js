const User = require('../models/user');
const Admin = require('../models/admin');
const Joi = require('joi');

/**
Loads the welcome page
 */
exports.index = {
  auth: false,
  handler: (request, reply) => {
    reply.view('main', {title: 'Welcome to MyTweet'});
  },
};

/**
Loads the sign up page
 */
exports.signup = {
  auth: false,
  handler: (request, reply) => {
    reply.view('signup', {title: 'Sign up for MyTweet'});
  },
};

/**
Loads the log in page
 */
exports.login = {
  auth: false,
  handler: (request, reply) => {
    reply.view('login', {title: 'Log in to MyTweet'});
  },
};

/**
Authenticates a user's login details
If successful, loads the user's homepage
If user has administrator password, loads the admin dashboard
 */
exports.authenticate = {
  auth: false,

  validate: {

    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },

    failAction: function (request, reply, source, error) {
      reply.view('login', {
        title: 'Log in error',
        errors: error.data.details,
      }).code(400);
    },

  },

  handler: function (request, reply) {
    const user = request.payload;

    // if user has admin password, load admin dashboard
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

    // if log in details valid, load user's homepage
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

/*
Logs a user out
 */
exports.logout = {
  auth: false,
  handler: function (request, reply) {
    request.cookieAuth.clear();
    reply.redirect('/');
  },
};

/**
 * Registers a new user to the db
 */
exports.register = {
  auth: false,

  validate: {

    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },

    failAction: function (request, reply, source, error) {
      reply.view('signup', {
        title: 'Sign up error',
        errors: error.data.details,
      }).code(400);
    },

  },

  handler: function (request, reply) {
    const user = new User(request.payload);
    user.save().then(newUser => {
      reply.redirect('/login');
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

/**
 * Displays the settings page
 */
exports.viewSettings = {
  handler: function (request, reply) {
    const userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).then(foundUser => {
      reply.view('settings', { title: 'Edit Account Settings', user: foundUser });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

/**
 * Updates a user's account settings
 */
exports.updateSettings = {
  handler: function (request, reply) {
    const loggedInUserEmail = request.auth.credentials.loggedInUser;
    const editedUser = request.payload;
    User.findOne({ email: loggedInUserEmail }).then(user => {
      if (!(editedUser.firstName === "")) { user.firstName = editedUser.firstName; }
      if (!(editedUser.lastName === "")) { user.lastName = editedUser.lastName; }
      if (!(editedUser.email === "")) { user.email = editedUser.email; }
      if (!(editedUser.password === "")) { user.password = editedUser.password; }
      return user.save();
    }).then(user => {
      reply.redirect('/home');
    }).catch(err => {
      reply.redirect('/');
    });
  },
};