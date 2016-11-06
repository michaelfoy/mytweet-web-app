'use strict';

const mongoose = require('mongoose');

/**
 * Model for user object
 */
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);
module.exports = User;