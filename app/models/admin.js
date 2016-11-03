'use strict';

const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
  email: String,
  password: String,
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;