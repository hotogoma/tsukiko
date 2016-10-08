const magic = require('../configs/magic.json');
const hpManager = require('hp-manager');

module.exports = (bot) => {
  const hpMane = new hpManager({
    db: bot.storage,
    max: 100,
    min: 0
  });

  bot.jobs.add('0 0 9 * * 6', () => {
    hpMane.full_care();
    bot.send('全回復しました');
  });

  bot.respond(/attack (\w+)/i, (msg) => {
    var user = msg.match[1];
    var damage = 10;
    var hp = hpMane.attack(user ,damage);
    msg.send(`${user}は攻撃された. ${damage}のダメージ！\nHP: ${hp}/${hpMane.getMax()}`);
  });

  bot.respond(/care (\w+)/i, (msg) => {
    var user = msg.match[1];
    var point = 10;
    var hp = hpMane.care(user ,point);
    msg.send(`${user}は${point}回復した. HP: ${hp}/${hpMane.getMax()}`);
  });

  bot.respond(/status$/i, (msg) => {
    var list = hpMane.status();
    var status = new Array();

    for(var key in list){
      status.push(`${key} HP: ${list[key]}/${hpMane.getMax()}`);
    }
    msg.send(status.join("\n"));
  });

  bot.respond(/status (\w+)/i, (msg) => {
    var user = msg.match[1];
    var status = hpMane.status(user);

    msg.send(`HP: ${status[user]}/${hpMane.getMax()}`);
  });

  bot.respond(/magic (\w+)/i, (msg) => {
    var user = msg.match[1];
    var magicNum = Math.floor(Math.random() * magic.length);
    var magicName = magic[magicNum].name;
    var damage = magic[magicNum].point;
    var hp = hpMane.attack(user ,damage);
    msg.send(`${user}は${magicName}で攻撃された. ${damage}のダメージ！\nHP: ${hp}/${hpMane.getMax()}`);
  });

  bot.respond(/delete (\w+)/i, (msg) => {
    var user = msg.match[1];
    var list = hpMane.delete(user);
    var status = new Array();

    for(var key in list){
      status.push(`${key} HP: ${list[key]}/${hpMane.getMax()}`);
    }
    msg.send(status.join("\n"));
  });

  // タイムラインを全て形態素解析する
  bot.hear(/.*/, (msg) => {
    if ( ! msg.tokenized ) { return; }
    var user = msg.user.name;
    var damage = 5;

    // ネガティブワードをキャッチする
    msg.tokenized.forEach((token) => {
      if ( /((疲|つか)れる)|((辛|つら)い)|((眠|ねむ)い)/.test(token.basic_form) ) {
        var hp = hpMane.attack(user ,damage);
        msg.send(`${user}は社会から攻撃を受けた！${damage}のダメージ！\nHP: ${hp}/${hpMane.getMax()}`);
      }
    });
  });
};
