const Slack = require('@slack/client');
const Message = require('./SlackMessage');
const JobList = require('./JobList');

class SlackBot {
  constructor(opts) {
    const logLevel = opts.debug ? 'debug' : 'error';
    this.rtm = new Slack.RtmClient(opts.token, { logLevel });
    this.web = new Slack.WebClient(opts.token, { logLevel });
    this.storage = opts.storage;
    this.middlewares = opts.middlewares || [];
    this.logger = opts.logger || console;
    this.default_channel = opts.default_channel;
    this.jobs = new JobList();

    this.user = {};
    this._patterns = { hear: [], respond: [] };

    this.rtm.on(Slack.CLIENT_EVENTS.RTM.AUTHENTICATED, (data) => this.user = data.self);
    this.rtm.on(Slack.CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => this.jobs.startAll());
    this.rtm.on(Slack.RTM_EVENTS.MESSAGE, this._onReceive.bind(this));
  }

  _onReceive(message) {
    if ( ! message.text ) return;
    var p = Promise.resolve( new Message(this, message) );
    this.middlewares.forEach((middleware) => {
      if ( typeof middleware.onReceive !== 'function' ) return;
      p = p.then((msg) => new Promise((next, error) => middleware.onReceive(msg, next, error)));
    });
    p.then((msg) => {
      if ( msg.isDirectMention() || msg.isDirectMessage() ) {
        this._patterns.respond.forEach((pattern) => {
          msg.match = pattern.regexp.reduce((v, r) => v || msg.text.match(r), null);
          if ( msg.match ) pattern.cb(msg);
        });
      }
      this._patterns.hear.forEach((pattern) => {
        msg.match = pattern.regexp.reduce((v, r) => v || msg.text.match(r), null);
        if ( msg.match ) pattern.cb(msg);
      });
    });
    p.catch((e) => this.logger.error(e));
  }

  start() {
    this.rtm.start();
  }

  send(msg) {
    if ( typeof msg !== 'object' ) msg = { text: msg };
    msg.channel = msg.channel || this.default_channel.id;
    msg.type = msg.type || Slack.RTM_EVENTS.MESSAGE;
    msg.attachments ? this._sendWeb(msg) : this.rtm.send(msg);
  }

  _sendWeb(msg) {
    msg.as_user = true;
    this.web.chat.postMessage(msg.channel, undefined, msg);
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
