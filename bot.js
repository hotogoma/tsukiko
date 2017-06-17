const Bot = require('shrike');
const utils = require('shrike-utils');
const express = require('express');
const bodyParser = require('body-parser');
const members = require('./configs/members');

Array.prototype.pickRandom = function () {
  return this[Math.floor(Math.random() * this.length)];
};

const bot = new Bot(process.env.SLACK_TOKEN, {
  default_channel: process.env.SLACK_DEFAULT_CHANNEL,
});

bot.storage = new utils.RedisStorage(process.env.REDIS_URL);

bot.jobs = new utils.JobList();

bot.http = express();
bot.http.use(bodyParser.urlencoded({ extended: false }));
bot.http.use(bodyParser.json());

const kuromoji = new utils.KuromojiMiddleware();
bot.on(Bot.EVENTS.MESSAGE.RECEIVED, kuromoji.onReceive.bind(kuromoji));

bot.loadDir('./scripts');

bot.start().then(() => {
  bot.data.members = members.map((member) => {
    const user = bot.data.users.filter(user => user.name === member.name)[0];
    if (user) member = Object.assign({}, user, member);
    return member;
  });
  bot.jobs.startAll();
  bot.http.listen(process.env.PORT || 80);
});
