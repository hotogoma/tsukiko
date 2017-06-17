const help = {
  title: 'Taisha',
  description: '退社したら通知',
};

const Shukjitz = require('shukjitz');
const shukjitz = new Shukjitz();

const token = process.env.HTTP_ACCESS_TOKEN;

module.exports = (bot) => {
  bot.http.post('/taisha', (req, res) => {
    if (token && req.query.token !== token) return res.send(401);
    const user = bot.data.members.filter(u => u.name === req.body.name)[0];
    if (!user) return res.send(404);

    const date = new Date();
    // 土日は通知しない
    if (date.getDay() % 6 === 0) return;
    // 祝日は通知しない
    if (shukjitz.checkSync(date)) return;
    // 16時以前は通知しない
    if (date.getHours() < 16) return;

    bot.send(`【${user.real_name}】ﾀｲｼｬ!!!`, () => res.send(200));
  });
};

module.exports.help = help;
