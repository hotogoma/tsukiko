const help = {
  title: 'AWS',
  description: [
    '`bot ec2 <InstanceName> start` EC2 インスタンスを起動',
    '`bot ec2 <InstanceName> stop` EC2 インスタンスを停止',
  ],
};

const AWS = require('aws-sdk');
const config = require('../configs/aws');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'ap-northeast-1',
});

const ec2 = new AWS.EC2();

module.exports = (bot) => {

  bot.respond(/^ec2 ([\w_]+) start$/i, (msg) => {
    const instance = config.instances.filter(v => v.name === name)[0]
    if (!instance) return msg.send('知らないインスタンスですね・・・');
    ec2.startInstances({ InstanceIds: [instance.id] }, (err, data) => {
      if (err) {
        console.error(err);
        msg.send('インスタンスの起動に失敗しました...');
      } else {
        msg.send('インスタンスを起動しました');
      }
    });
  });

  bot.respond(/^ec2 ([\w_]+) stop$/i, (msg) => {
    const instance = config.instances.filter(v => v.name === name)[0]
    if (!instance) return msg.send('知らないインスタンスですね・・・');
    ec2.stopInstances({ InstanceIds: [instance.id] }, (err, data) => {
      if (err) {
        console.error(err);
        msg.send('インスタンスの停止に失敗しました...');
      } else {
        msg.send('インスタンスを停止しました');
      }
    });
  });

}

module.exports.help = help;
