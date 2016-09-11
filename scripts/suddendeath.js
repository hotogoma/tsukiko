const SuddenDeath = require('sudden-death');

module.exports = (bot) => {

  bot.hear(/^突然の(.*)$/, (msg) => {
    msg.send( new SuddenDeath( msg.match[1] ).say() );
  });

};
