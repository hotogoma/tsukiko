const IRKit = require('irkit');
const signals = require('../configs/irkit.json');

const irkit = new IRKit({
  clientKey: process.env.IRKIT_CLIENT_KEY,
  deviceId:  process.env.IRKIT_DEVICE_ID,
});

const patterns = [
  { regexp: /テレビ(点|つ)けて/i,             signal: signals.tv.power,       message: 'テレビをつけましたよ'   },
  { regexp: /テレビ(消|け)して/i,             signal: signals.tv.power,       message: 'テレビを消しましたよ'   },
  { regexp: /エアコン(点|つ)けて/i,           signal: signals.aircon.on,      message: 'エアコンをつけましたよ' },
  { regexp: /エアコン(消|け)して/i,           signal: signals.aircon.off,     message: 'エアコンを消しましたよ' },
  { regexp: /Apple\s?TV/i,                    signal: signals.appletv.select, message: 'AppleTV をつけましたよ' },
  { regexp: /(電気|照明|ライト)(点|つ)けて/i, signal: signals.light.on,       message: '照明をつけましたよ'     },
  { regexp: /(電気|照明|ライト)(消|け)して/i, signal: signals.light.off,      message: '照明を消しましたよ'     },
];

module.exports = (bot) => {
  if ( ! irkit.available() ) return;

  patterns.forEach((pattern) => {
    bot.respond(pattern.regexp, (msg) => {
      irkit.send( pattern.signal )
        .then(() => msg.send( pattern.message ))
        .catch((errMsg) => msg.send( errorMsg ));
    });
  });
}
