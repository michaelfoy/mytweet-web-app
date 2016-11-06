'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

/**
 * Seeds the mongo database with default data
 */
const seedDb = function() {
  let seeder = require('mongoose-seeder');
  const data = require('./data.json');
  const Tweet = require('./tweet');
  const User = require('./user');
  seeder.seed(data, { dropDatabase: false, dropCollections: true }).then(dbData => {
    console.log('preloading Test Data');
    console.log(dbData);
  }).catch(err => {
    console.log(error);
  });
};

let dbURI = 'mongodb://localhost/mytweet';
    //'mongodb://michaelfoy:adminsecret@ds143717.mlab.com:43717/mytweet'
    //'mongodb://localhost/mytweet';

if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.MONGOLAB_URI;
}

mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
  if (process.env.NODE_ENV != 'production') {
    seedDb();
  } else {
    console.log('production db');
    mongoose.connection.db.collection('users').count(function(err, count) {
      console.dir(err);
      console.dir(count);

      if( count == 0) {
        console.log("No Found Records.");
        console.log("Seeding db with simpsons data")
        seedDb();
      }
      else {
        console.log("Found Records : " + count);
      }
    });
  }
});

mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});
