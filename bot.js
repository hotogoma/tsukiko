const SlackBot = require('./lib/SlackBot');
const RedisStorage = require('./lib/RedisStorage');
const JobList = require('./lib/JobList');
const express = require('express');
const bodyParser = require('body-parser');
const KuromojiMiddleware = require('./lib/KuromojiMiddleware');
const members = require('./configs/members');
const scripts = require('./scripts');

Array.prototype.pickRandom = function() {
  return this[ Math.floor( Math.random() * this.length ) ];
};

const bot = new SlackBot(process.env.SLACK_TOKEN, {
  default_channel: process.env.SLACK_DEFAULT_CHANNEL,
});

bot.storage = new RedisStorage( process.env.REDIS_URL );

bot.jobs = new JobList();

bot.http = express();
bot.http.use(bodyParser.json());

const kuromoji = new KuromojiMiddleware();
bot.on(SlackBot.EVENTS.MESSAGE.RECEIVED, kuromoji.onReceive.bind(kuromoji));

scripts.forEach((script) => script(bot));

bot.start(() => {
  bot.data.members = members.map((member) => {
    const user = bot.data.users.filter((user) => user.name === member.name)[0];
    if ( user ) member = Object.assign({}, user, member);
    return member;
  });
  bot.jobs.startAll();
  bot.http.listen( process.env.HTTP_PORT || 80 );
});
