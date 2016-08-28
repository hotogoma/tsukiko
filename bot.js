const RtmClient = require('@slack/client').RtmClient;
const RedisStorage = require('./lib/RedisStorage');

const RTM = new RtmClient( process.env.SLACK_TOKEN );
const Storage = new RedisStorage( process.env.REDIS_URL );

RTM.start();
