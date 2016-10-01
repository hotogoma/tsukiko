const help = {
  title: 'Calendar',
  description: [
    '毎朝その日のことを通知',
    '`bot 今日` 今日のことを通知'
  ],
};

const sprintf = require('sprintf');
const Shukjitz = require('shukjitz');
const date2sekki = require('../lib/date2sekki');

const shukjitz = new Shukjitz();

function getDateAttachment(date) {
  const attachment = { fields: [] };

  // 日付
  const holiday = shukjitz.checkSync(date);
  const title = sprintf('%02d月%02d日(%s%s)%s です',
    date.getMonth() + 1,
    date.getDate(),
    '日月火水木金土'.charAt( date.getDay() ),
    holiday ? '祝' : '',
    holiday ? ` ${holiday}` : ''
  );
  attachment.title = title;
  attachment.fallback = title;

  // 二十四節気
  const sekki = date2sekki( date );
  if ( sekki ) {
    attachment.fields.push({
      title: sekki[0] + ' (二十四節気)',
      value: sekki[1] + '〜',
    });
  }

  return attachment;
}

module.exports = (bot) => {

  bot.respond(/今日/, (msg) => {
    const attachment = getDateAttachment( new Date() );
    bot.send({ attachments: [ attachment ] });
  });

  bot.jobs.add('0 30 7 * * *', () => {
    const attachment = getDateAttachment( new Date() );
    bot.send({ attachments: [ attachment ] });
  });

};

module.exports.help = help;
