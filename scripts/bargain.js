const Cookpad = require('../lib/Cookpad');

const BARGAINS = [
  //{
  //  shop: '文化堂 戸越銀座店',
  //  url: 'https://cookpad.com/bargains/%E6%96%87%E5%8C%96%E5%A0%82/4114',
  //},
  {
    shop: 'オオゼキ 戸越公園店',
    url: 'https://cookpad.com/bargains/%E3%82%AA%E3%82%AA%E3%82%BC%E3%82%AD/8406',
  },
];

function items2attachment(bargain, items) {
  return {
    fallback: '今日の特売情報です',
    title: `今日の <${bargain.url}|${bargain.shop} の特売情報> です`,
    text: items.map((item) => `・ ${item.name} (${item.price}円)`).join("\n"),
  };
}

module.exports = (bot) => {

  bot.respond(/特売/, (msg) => {
    const bargain = BARGAINS[0];
    Cookpad.bargains(bargain.url).then((items) => {
      msg.send({ attachments: [ items2attachment(bargain, items) ] });
    });
  });

  bot.jobs.add('0 0 19 * * *', () => {
    const bargain = BARGAINS[0];
    Cookpad.bargains(bargain.url).then((items) => {
      bot.send({ attachments: [ items2attachment(bargain, items) ] });
    });
  });

}
