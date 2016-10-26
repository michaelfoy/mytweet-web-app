const Accounts = require('./app/controllers/accounts.js');
const MyTweet = require('./app/controllers/mytweet.js')

module.exports = [

  { method: 'GET', path: '/', config: Accounts.index },
  { method: 'GET', path: '/signup', config: Accounts.signup },
  { method: 'GET', path: '/login', config: Accounts.login },
  { method: 'POST', path: '/login', config: Accounts.authenticate },
  { method: 'GET', path: '/logout', config: Accounts.logout },
  { method: 'POST', path: '/register', config: Accounts.register },

  { method: 'GET', path: '/home', config: MyTweet.home },
  { method: 'POST', path: '/newTweet', config: MyTweet.newTweet },
  { method: 'GET', path: '/profilepage', config: MyTweet.profilepage },

];