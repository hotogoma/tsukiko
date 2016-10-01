const help = {
  title: 'Image',
  description: [
    '`bot image <string>` 画像を検索',
  ],
};

const GoogleImages = require('google-images');

const GOOGLE_CSE_ID  = process.env.GOOGLE_CSE_ID;
const GOOGLE_CSE_KEY = process.env.GOOGLE_CSE_KEY;

module.exports = (bot) => {
  if ( ! GOOGLE_CSE_ID || ! GOOGLE_CSE_KEY ) return;

  const client = GoogleImages(GOOGLE_CSE_ID, GOOGLE_CSE_KEY);

  bot.respond(/image (.+)$/i, (msg) => {
    client.search(msg.match[1]).then((images) => {
      if ( images.length > 0 ) msg.send( images.pickRandom().url );
    }).catch((e) => console.error(e))
  });
}

module.exports.help = help;
