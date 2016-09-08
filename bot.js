const SlackBot = require('./lib/SlackBot');
const RedisStorage = require('./lib/RedisStorage');

const bot = new SlackBot({
  token: process.env.SLACK_TOKEN,
  default_channel: { id: process.env.SLACK_DEFAULT_CHANNEL_ID },
  storage: new RedisStorage( process.env.REDIS_URL ),
  debug: process.env.NODE_ENV !== 'production',
});


bot.hear(/hoge/, (msg) => {
  msg.send('foo');
  msg.reply('bar');
});

bot.respond(/天気/, (msg) => {
  var title = '明日の天気は 雪 です';
  var attachment = {
    fallback: title,
    title: title,
    fields: [
      { title: '最高気温', value: '10℃ (-2℃)', short: true },
      { title: '最低気温', value: '-2℃ (-5℃)', short: true },
    ],
  };
  msg.reply({ text: '天気です', attachments: [ attachment ] });
});

bot.jobs.add('0 0 19 * * *', () => {
  bot.send('19時ですよ');
});


bot.start();
