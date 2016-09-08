const Slack = require('@slack/client');
const Message = require('./SlackMessage');
const JobList = require('./JobList');

class SlackBot {
  constructor(opts) {
    const logLevel = opts.debug ? 'debug' : 'error';
    this.rtm = new Slack.RtmClient(opts.token, { logLevel });
    this.storage = opts.storage;
    this.default_channel = opts.default_channel;
    this.jobs = new JobList();

    this.user = {};
    this._patterns = { hear: [], respond: [] };

    this.rtm.on(Slack.CLIENT_EVENTS.RTM.AUTHENTICATED, (data) => this.user = data.self);
    this.rtm.on(Slack.CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => this.jobs.startAll());
    this.rtm.on(Slack.RTM_EVENTS.MESSAGE, this._onReceive.bind(this));
  }

  _onReceive(message) {
    const msg = new Message(this, message);
    if ( msg.isDirectMention() || msg.isDirectMessage() ) {
      this._patterns.respond.forEach((pattern) => {
        let matched = pattern.regexp.reduce((v, r) => v || msg.text.match(r), false);
        if ( matched ) pattern.cb(msg);
      });
    }
    this._patterns.hear.forEach((pattern) => {
      let matched = pattern.regexp.reduce((v, r) => v || msg.text.match(r), false);
      if ( matched ) pattern.cb(msg);
    });
  }

  start() {
    this.rtm.start();
  }

  send(msg) {
    if ( typeof msg !== 'object' ) msg = { text: msg };
    msg.channel = msg.channel || this.default_channel.id;
    msg.type = msg.type || Slack.RTM_EVENTS.MESSAGE;
    // attachments があったら Web Client で送る
    this.rtm.send(msg);
  }

  _registerPattern(key, regexp, cb) {
    if ( typeof cb !== 'function' ) throw new TypeError();
    if ( ! Array.isArray(regexp) ) regexp = [regexp];
    regexp = regexp.map((r) => r instanceof RegExp ? r : new RegExp(r));
    this._patterns[key].push({ regexp, cb });
  }

  hear(regexp, cb) {
    this._registerPattern('hear', regexp, cb);
  }

  respond(regexp, cb) {
    this._registerPattern('respond', regexp, cb);
  }
}

module.exports = SlackBot;
