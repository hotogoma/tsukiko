module.exports = (bot) => {
  bot.respond(/ぺろぺろ/i, msg => msg.reply('まったくどうしようもない変態さんですね'));
  bot.hear(/月子ちゃんぺろぺろ/i, msg => msg.reply('まったくどうしようもない変態さんですね'));
  bot.hear(/^月子ちゃん$/i, msg => msg.reply('なんですか'));
  bot.hear(/(疲|つか)れた/i, msg => msg.reply('おつかれさまです先輩'));

  bot.respond(/(花金|華金|はなきん)$/i, msg => msg.send('花金だーワッショーイ！テンションAGEAGEマック'));

  bot.respond(/say (.+)/i, msg => bot.send(msg.match[1]));

  bot.respond(/PING$/i, msg => msg.reply('PONG!'));

  // 日本語版 ping (http://pasero.net/~mako/blog/s/679)
  const pingRegExp = /(((い|ゐ|居)(て?))(?!り)|(お|を|居)|((い|居)(て?)は)(?!ま))((る|ん(?=の))|((り?)ます)(?!ん))((の?ん?)(です)?|(んだ)(?!か))?(か(い?な?|よ|ね)?|(よ?)(ね|な))?\s?(\?|？)/i;
  bot.respond(pingRegExp, msg => msg.send('はい'));

  // メンション内容を形態素解析して反応する
  bot.respond(/.*/, (msg) => {
    if (!msg.tokenized) return;

    // 感動詞をオウム返しする
    msg.tokenized.forEach((token) => {
      if (token.pos == '感動詞') msg.reply(token.surface_form);
    });
  });
};
