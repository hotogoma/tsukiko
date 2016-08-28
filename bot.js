const RtmClient = require('@slack/client').RtmClient;
const RedisStorage = require('./lib/RedisStorage');
const JobList = require('./lib/JobList');

const RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS.RTM;

const RTM = new RtmClient( process.env.SLACK_TOKEN );
const Storage = new RedisStorage( process.env.REDIS_URL );
const Jobs = new JobList();

RTM.on(RTM_CLIENT_EVENTS.RTM_CONNECTION_OPENED, () => {
  Jobs.startAll();
});

RTM.start();
