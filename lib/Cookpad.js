const http = require('thip');
const cheerio = require('cheerio');

class Cookpad {
  // 特売情報を取得する
  static bargains(url) {
    return http.get(url).then((res) => {
      const $ = cheerio.load(res.body);
      const items = $('.product').map((i, item) => ({
        name: $(item).find('.name a').text(),
        price: $(item).find('.price_and_label .number').text(),
      }));
      return Promise.resolve(items.get().filter(i => !!i.name));
    });
  }
}

module.exports = Cookpad;
