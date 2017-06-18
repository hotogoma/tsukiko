const help = {
  title: 'IRKit',
  description: [
    '毎朝 7時半に照明を点ける / 9時半に照明を消す',
    '`bot テレビ(つけて/消して)` テレビを操作',
    '`bot エアコン(つけて/消して)` エアコンを操作',
    '`bot 電気(つけて/消して)` 照明を操作',
  ],
};

const IRKit = require('irkit');
const signals = require('../configs/irkit.json');

const irkit = new IRKit({
  clientKey: process.env.IRKIT_CLIENT_KEY,
  deviceId: process.env.IRKIT_DEVICE_ID,
});

/* eslint-disable no-multi-spaces */
const patterns = [
  { regexp: /テレビ(点|つ)けて/i,             signal: signals.tv.power,       message: 'テレビをつけましたよ'   },
  { regexp: /テレビ(消|け)して/i,             signal: signals.tv.power,       message: 'テレビを消しましたよ'   },
  { regexp: /エアコン(点|つ)けて/i,           signal: signals.aircon.on,      message: 'エアコンをつけましたよ' },
  { regexp: /エアコン(消|け)して/i,           signal: signals.aircon.off,     message: 'エアコンを消しましたよ' },
  { regexp: /Apple\s?TV/i,                    signal: signals.appletv.select, message: 'AppleTV をつけましたよ' },
  { regexp: /(電気|照明|ライト)(点|つ)けて/i, signal: signals.light.on,       message: '照明をつけましたよ'     },
  { regexp: /(電気|照明|ライト)(消|け)して/i, signal: signals.light.off,      message: '照明を消しましたよ'     },
];
/* eslint-enable no-multi-spaces */

module.exports = (bot) => {
  if (!irkit.available()) return;

  patterns.forEach((pattern) => {
    bot.respond(pattern.regexp, (msg) => {
      irkit.send(pattern.signal)
        .then(() => msg.send(pattern.message))
        .catch(errMsg => msg.send(errMsg));
    });
  });

  // 7時半に照明を点ける / 9時半に照明を消す
  bot.jobs.add('0 30 7 * * *', () => irkit.send(signals.light.on));
  bot.jobs.add('0 30 9 * * *', () => irkit.send(signals.light.off));
};

module.exports.help = help;
