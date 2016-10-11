exports.home = {
  handler: (request, reply) => {
    reply.view('home', { title: 'MyTweet' });
  },
};