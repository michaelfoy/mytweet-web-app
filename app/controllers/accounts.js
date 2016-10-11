exports.index = {

  handler: (request, reply) => {
    reply.view('main', { title: 'Welcome to MyTweet' });
  },

};

exports.signup = {

  handler: (request, reply) => {
    reply.view('signup', { title: 'Sign up for MyTweet' });
  },

};

exports.login = {

  handler: (request, reply) => {
    reply.view('login', { title: 'Log in to MyTweet' });
  },

};