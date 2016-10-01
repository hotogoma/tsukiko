const SlackBot = require('slackbot');
const utils = require('slackbot-utils');
const express = require('express');
const bodyParser = require('body-parser');
const members = require('./configs/members');
const scripts = require('./scripts');

Array.prototype.pickRandom = function() {
  return this[ Math.floor( Math.random() * this.length ) ];
};

const bot = new SlackBot(process.env.SLACK_TOKEN, {
  default_channel: process.env.SLACK_DEFAULT_CHANNEL,
});

bot.storage = new utils.RedisStorage( process.env.REDIS_URL );

bot.jobs = new utils.JobList();

bot.http = express();
bot.http.use(bodyParser.json());

const kuromoji = new utils.KuromojiMiddleware();
bot.on(SlackBot.EVENTS.MESSAGE.RECEIVED, kuromoji.onReceive.bind(kuromoji));

var helps = [];
scripts.forEach((script) => {
  if ( script.help ) helps.push( script.help );
  script(bot);
});

bot.respond(/help$/i, (msg) => {
  text = '';
  helps.map((help) => {
    if ( help.title ) text += `*${help.title}*\n`;
    if ( help.description ) {
      let description = help.description;
      if ( ! Array.isArray(description) ) description = description.split("\n");
      text += description.map((s) => "\t" + s.replace(/^`bot (.+)`/, '`' + bot.data.self.name + ' $1`')).join("\n");
    }
    text += "\n";
  });
  msg.send(text);
});

bot.start(() => {
  bot.data.members = members.map((member) => {
    const user = bot.data.users.filter((user) => user.name === member.name)[0];
    if ( user ) member = Object.assign({}, user, member);
    return member;
  });
  bot.jobs.startAll();
  bot.http.listen( process.env.PORT || 80 );
});
