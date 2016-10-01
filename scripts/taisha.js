const token = process.env.HTTP_ACCESS_TOKEN;

module.exports = (bot) => {

  bot.http.post('/taisha', (req, res) => {
    if ( token && req.query.token !== token ) return res.send(401);
    const user = bot.data.members.filter((u) => u.name === req.body.name)[0];
    if ( ! user ) return res.send(404);
    bot.send(`【${user.real_name}】ﾀｲｼｬ!!!`, () => res.send(200));
  });

};
