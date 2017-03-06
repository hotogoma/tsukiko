const help = {
  title: 'Switch',
  description: '日が沈んだらスイッチやっていい',
};

const token = process.env.HTTP_ACCESS_TOKEN;

module.exports = (bot) => {

  bot.http.post('/switch', (req, res) => {
    if ( token && req.query.token !== token ) return res.send(401);
    if ( req.body.status === 'sunset') bot.send('スイッチ オン!!');
    res.send(200);
  });

};

module.exports.help = help;
