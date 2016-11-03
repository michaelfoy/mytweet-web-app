const Accounts = require('./app/controllers/accounts.js');
const MyTweet = require('./app/controllers/mytweet.js');
const Admin = require('./app/controllers/admin.js');

module.exports = [

  { method: 'GET', path: '/', config: Accounts.index },
  { method: 'GET', path: '/signup', config: Accounts.signup },
  { method: 'GET', path: '/login', config: Accounts.login },
  { method: 'POST', path: '/login', config: Accounts.authenticate },
  { method: 'GET', path: '/logout', config: Accounts.logout },
  { method: 'POST', path: '/register', config: Accounts.register },

  { method: 'GET', path: '/home', config: MyTweet.home },
  { method: 'POST', path: '/newTweet', config: MyTweet.newTweet },
  { method: 'GET', path: '/profilepage/{email}', config: MyTweet.profilepage },
  { method: 'POST', path: '/deleteTweets/{email}', config: MyTweet.delete },

  { method: 'GET', path: '/admin', config: Admin.home },
  { method: 'POST', path: '/deleteUser', config: Admin.deleteuser },
  { method: 'POST', path: '/adminregister', config: Admin.register },
  { method: 'POST', path: '/selectUser', config: Admin.selectUser },
  { method: 'POST', path: '/admindeletetweets', config: Admin.deletetweets },

];