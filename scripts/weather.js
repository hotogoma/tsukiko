const help = {
  title: 'Weather',
  description: [
    '毎晩 次の日の天気を表示',
    '`bot 天気` 明日の天気を調べる',
  ],
};

const getWeather = require('../lib/weather');

function weather2slackAttachment(weather) {
  const title = '明日の天気は ' + weather.emoji + ' です';
  const attachment = {
    fallback: title,
    title: title,
    fields: [
      { title: '最高気温', value: `${weather.max}℃ (${weather.diffMaxStr}℃)`, short: true },
      { title: '最低気温', value: `${weather.min}℃ (${weather.diffMinStr}℃)`, short: true },
    ],
  };
  if ( weather.weather.match(/雨/) ) {
    attachment.text = '傘を忘れないでください';
    attachment.color = '#439FE0';
  }
  return attachment;
}

module.exports = (bot) => {

  bot.respond(/天気/, (msg) => {
    getWeather().then((weather) => {
      msg.send({ attachments: [ weather2slackAttachment(weather) ] });
    });
  });

  bot.jobs.add('0 0 22 * * *', () => {
    getWeather().then((weather) => {
      bot.send({ attachments: [ weather2slackAttachment(weather) ] });
    });
  });

}

module.exports.help = help;
