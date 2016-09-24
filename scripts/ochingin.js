const Ochingin = require('ochingin');
const Shukjitz = require('shukjitz');

module.exports = (bot) => {
  const shukjitz = new Shukjitz({}, () => {
    const isHoliday = Shukjitz.prototype.checkSync.bind(shukjitz);

    bot.jobs.add('0 0 19 * * *', () => {
      bot.data.members.forEach((member) => {
        if ( ! new Ochingin(member.ochingin, isHoliday).check() ) return;
        bot.send(`${member.real_name}氏のおちんぎんが入りましたよ :moneybag:`);
      });
    });

    // TODO 次の給料日までのカウントダウン
  });
}
