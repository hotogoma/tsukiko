const token = process.env.HTTP_ACCESS_TOKEN;

module.exports = (bot) => {

  bot.http.post('/taisha', (req, res) => {
    if ( token && req.query.token !== token ) return res.send(401);
    bot.send(`【${req.body.username}】ﾀｲｼｬ!!!`, () => res.send(200));
  });

};
