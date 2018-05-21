const help = {
  title: 'AWS',
  description: [
    '`bot ec2 status` 各 EC2 インスタンスの起動状況を表示',
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

function getInstanceId(name) {
  const instance = config.instances.filter(i => i.name.toLowerCase() === name.toLowerCase())[0];
  return instance ? instance.id : null;
}

function getInstanceName(id) {
  const instance = config.instances.filter(i => i.id === id)[0];
  return instance ? instance.name : null;
}

module.exports = (bot) => {
  bot.respond(/^ec2 ([\w_]+) start$/i, (msg) => {
    const id = getInstanceId(msg.match[1]);
    if (!id) return msg.send('知らないインスタンスですね・・・');
    ec2.startInstances({ InstanceIds: [id] }, (err) => {
      if (err) {
        bot.logger.error(err);
        msg.send('インスタンスの起動に失敗しました...');
      } else {
        msg.send('インスタンスを起動しました');
      }
    });
  });

  bot.respond(/^ec2 ([\w_]+) stop$/i, (msg) => {
    const id = getInstanceId(msg.match[1]);
    if (!id) return msg.send('知らないインスタンスですね・・・');
    ec2.stopInstances({ InstanceIds: [id] }, (err) => {
      if (err) {
        bot.logger.error(err);
        msg.send('インスタンスの停止に失敗しました...');
      } else {
        msg.send('インスタンスを停止しました');
      }
    });
  });

  bot.respond(/^ec2 status$/i, (msg) => {
    const stateIcons = {
      running: 'large_blue_circle',
      terminated: 'red_circle',
      stopped: 'white_circle',
    };
    ec2.describeInstanceStatus({ IncludeAllInstances: true }, (err, data) => {
      if (err) {
        bot.logger.error(err);
        return msg.send('インスタンス情報の取得に失敗しました...');
      }
      const text = data.InstanceStatuses.map((instance) => {
        const id = instance.InstanceId;
        const state = instance.InstanceState.Name;
        const icon = stateIcons[state] || 'large_orange_diamond';
        const name = getInstanceName(id);
        const nameLabel = name ? ` (*${name}*)` : '';
        return `:${icon}: \`${id}\`${nameLabel} is ${state}`;
      });
      msg.send(text.join('\n'));
    });
  });

  //// インスタンスが起動中の場合は１時間に１回通知する
  //bot.jobs.add('0 0 * * * *', () => {
  //  ec2.describeInstanceStatus((err, data) => {
  //    if (err) {
  //      bot.logger.error(err);
  //      return bot.send('インスタンス情報の取得に失敗しました...');
  //    }
  //    const count = data.InstanceStatuses.length;
  //    if (count > 0) bot.send(`${count} 台の EC2 インスタンスが起動中です`);
  //  });
  //});
};

module.exports.help = help;
