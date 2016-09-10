const SlackBot = require('./lib/SlackBot');
const RedisStorage = require('./lib/RedisStorage');


const bot = new SlackBot({
  token: process.env.SLACK_TOKEN,
  default_channel: { id: process.env.SLACK_DEFAULT_CHANNEL_ID },
  storage: new RedisStorage( process.env.REDIS_URL ),
  debug: process.env.NODE_ENV !== 'production',
});


bot.respond(/ぺろぺろ/i, (msg) => msg.reply('まったくどうしようもない変態さんですね'));
bot.hear(/月子ちゃんぺろぺろ/i, (msg) => msg.reply('まったくどうしようもない変態さんですね'));
bot.hear(/^月子ちゃん$/i, (msg) => msg.reply('なんですか'));
bot.hear(/(疲|つか)れた/i, (msg) => msg.reply('おつかれさまです先輩'));

bot.respond(/(花金|華金|はなきん)$/i, (msg) => msg.send('花金だーワッショーイ！テンションAGEAGEマック'));

bot.respond(/say (.+)/i, (msg) => bot.send(msg.match[1]));

bot.respond(/PING$/i, (msg) => msg.reply('PONG!'));

// 日本語版 ping (http://pasero.net/~mako/blog/s/679)
const pingRegex = /(((い|ゐ|居)(て?))(?!り)|(お|を|居)|((い|居)(て?)は)(?!ま))((る|ん(?=の))|((り?)ます)(?!ん))((の?ん?)(です)?|(んだ)(?!か))?(か(い?な?|よ|ね)?|(よ?)(ね|な))?\s?(\?|？)/i;
bot.respond(pingRegex, (msg) => msg.send('はい'));

// eval.js
const SafeEval = require('./lib/SafeEval');
bot.respond(/eval (.+)$/i, (msg) => bot.send(SafeEval(msg.match[1])));

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
