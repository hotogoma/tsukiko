const help = {
  title: 'SuddenDeath',
  description: [
    '`bot 突然の<string>` 突然死ぬ',
  ],
};

const SuddenDeath = require('sudden-death');

module.exports = (bot) => {

  bot.hear(/^突然の(.*)$/, (msg) => {
    msg.send( new SuddenDeath( msg.match[1] ).say() );
  });

};

module.exports.help = help;
