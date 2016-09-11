const SafeEval = require('../lib/SafeEval');

module.exports = (bot) => {
  bot.respond(/eval (.+)$/i, (msg) => {
    bot.send( SafeEval( msg.match[1] ) );
  });
}
