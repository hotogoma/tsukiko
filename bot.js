const SlackBot = require('./lib/SlackBot');
const RedisStorage = require('./lib/RedisStorage');
const KuromojiMiddleware = require('./lib/KuromojiMiddleware');
const scripts = require('./scripts');

Array.prototype.pickRandom = function() {
  return this[ Math.floor( Math.random() * this.length ) ];
};

const bot = new SlackBot({
  token: process.env.SLACK_TOKEN,
  default_channel: { id: process.env.SLACK_DEFAULT_CHANNEL_ID },
  storage: new RedisStorage( process.env.REDIS_URL ),
  middlewares: [ new KuromojiMiddleware() ],
  debug: process.env.NODE_ENV !== 'production',
});

scripts.forEach((script) => script(bot));

bot.start();
