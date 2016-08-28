const RtmClient = require('@slack/client').RtmClient;

const RTM = new RtmClient( process.env.SLACK_TOKEN );

RTM.start();
