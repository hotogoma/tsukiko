const help = {
  title: 'Loan',
  description: [
    '`bot loan` 残額を表示',
    '`bot loan init <num>` 残額を初期化 (単位: 万円)',
    '`bot loan +<num>` 残額を増やす (単位: 万円)',
    '`bot loan -<num>` 残額を減らす (単位: 万円)',
  ],
};

const LOAN_KEY = process.env.LOAN_KEY || 'loan';

module.exports = (bot) => {
  function showRemain(msg) {
    return bot.storage.get(LOAN_KEY).then((remain) => {
      msg.send(`現在の残額は ${remain || 0} 万円です`);
    });
  }

  bot.respond(/loan$/i, showRemain);

  bot.respond(/loan init (\d+)$/i, (msg) => {
    const init = msg.match[1];
    showRemain(msg)
      .then(() => bot.storage.set(LOAN_KEY, init))
      .then(() => msg.send(`残額を ${init} 万円に設定しました`));
  });

  bot.respond(/loan ((\+|-)?\s?\d+(\.\d+)?)/i, (msg) => {
    const n = parseFloat(msg.match[1].replace(/\s+/, ''));
    if (isNaN(n)) { return msg.send('有効な金額ではありません(´･_･`)'); }
    bot.storage.get(LOAN_KEY).then((remain) => {
      remain = parseFloat(remain) || 0;
      return bot.storage.set(LOAN_KEY, remain + n);
    }).then(() => {
      if (n < 0) { msg.send(`残額が ${-n} 万円減りました(ﾟ∀ﾟ)`); }
      if (n > 0) { msg.send(`残額が ${n} 万円増えました(´･_･\`)`); }
      showRemain(msg);
    });
  });
};

module.exports.help = help;
