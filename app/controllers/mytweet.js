exports.home = {
  handler: (request, reply) => {
    reply.view('home', { title: 'MyTweet' });
  },
};

exports.newTweet = {
  handler: (request, reply) => {

  },
};