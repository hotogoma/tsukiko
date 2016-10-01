const help = {
  title: 'Eval',
  description: [
    '`bot eval <code>` JavaScript のコードを実行する'
  ],
};

const SafeEval = require('../lib/SafeEval');

module.exports = (bot) => {
  bot.respond(/eval (.+)$/i, (msg) => {
    bot.send( SafeEval( msg.match[1] ) );
  });
}

module.exports.help = help;
