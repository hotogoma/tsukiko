const help = {
  title: 'Calendar',
  description: [
    '毎朝 その日のことを通知',
    '毎晩 明日がごみの日かどうか通知',
    '`bot 今日` 今日のことを通知',
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
    '日月火水木金土'.charAt(date.getDay()),
    holiday ? '祝' : '',
    holiday ? ` ${holiday}` : '',
  );
  attachment.title = title;
  attachment.fallback = title;

  // 二十四節気
  const sekki = date2sekki(date);
  if (sekki) {
    attachment.fields.push({
      title: `${sekki[0]} (二十四節気)`,
      value: `${sekki[1]}〜`,
    });
  }

  return attachment;
}

module.exports = (bot) => {
  bot.respond(/今日/, () => {
    const attachment = getDateAttachment(new Date());
    bot.send({ attachments: [attachment] });
  });

  bot.jobs.add('0 30 7 * * *', () => {
    const attachment = getDateAttachment(new Date());
    bot.send({ attachments: [attachment] });
  });

  bot.jobs.add('0 0 19 * * 1-5', () => {
    if (shukjitz.checkSync()) return;
    bot.send('19時ですよ\nまだ働いているんですか');
  });

  bot.jobs.add('0 0 22 * * *', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const weekNum = Math.floor((tomorrow.getDate() - 1) / 7) + 1;

    // ごみの日
    let trash = null;
    switch (tomorrow.getDay()) {
      case 3: // 水曜
      case 6: // 土曜
        trash = ':fire: 可燃ごみ';
        break;
      case 5: // 金曜
        trash = ':recycle: 資源ごみ';
        break;
      case 2: // 第１・第３火曜
        if (weekNum === 1 || weekNum === 3) {
          trash = ':battery: 不燃ごみ';
        }
        break;
    }

    if (trash) {
      const text = `明日は ${trash} の日です`;
      bot.send({ attachments: [{ fallback: text, title: text }] });
    }
  });
};

module.exports.help = help;
