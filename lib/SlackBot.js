const Slack = require('@slack/client');
const Message = require('./SlackMessage');
const EventEmitter = require('events');

const EVENTS = {
  AUTHENTICATED: 'authenticated',
  CONNECTION: {
    OPENED: 'connection.opened',
  },
  MESSAGE: {
    RECEIVED: 'message.received',
  },
};

class SlackBot extends EventEmitter {
  constructor(token, opts = {}) {
    super();
    const debug = opts.debug !== undefined ? opts.debug : process.env.NODE_ENV !== 'production';
    const logLevel = debug ? 'debug' : 'error';
    this.rtm = new Slack.RtmClient(token, { logLevel });
    this.web = new Slack.WebClient(token, { logLevel });
    this.logger = opts.logger || console;

    this.rtm.on(Slack.CLIENT_EVENTS.RTM.AUTHENTICATED, (data) => {
      this.default_channel = opts.default_channel
        ? data.channels.filter((c) => c.name === opts.default_channel)[0]
        : data.channels.filter((c) => c.is_general)[0];
      this.user = data.self;
      this.emit(EVENTS.AUTHENTICATED, data);
    });
    this.rtm.on(Slack.CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => this.emit(EVENTS.CONNECTION.OPENED));
    this.rtm.on(Slack.RTM_EVENTS.MESSAGE, this._onReceive.bind(this));
    this.setMaxListeners(Infinity);
  }

  _onReceive(message) {
    if ( ! message.text ) return;
    var p = Promise.resolve( new Message(this, message) );
    this.listeners(EVENTS.MESSAGE.RECEIVED).forEach((cb) => {
      p = p.then((msg) => new Promise((next, error) => cb(msg, next, error)));
    });
    p.then((msg) => {
      if ( msg.isDirectMention() || msg.isDirectMessage() ) {
        this.emit('respond', msg);
      }
      this.emit('hear', msg);
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

  hear(regexp, cb) {
    this._register('hear', regexp, cb);
  }

  respond(regexp, cb) {
    this._register('respond', regexp, cb);
  }

  _register(eventName, regexp, cb) {
    if ( typeof cb !== 'function' ) throw new TypeError();
    if ( ! Array.isArray(regexp) ) regexp = [regexp];
    regexp = regexp.map((r) => r instanceof RegExp ? r : new RegExp(r));
    this.on(eventName, (msg) => {
      msg.match = regexp.reduce((v, r) => v || msg.text.match(r), null);
      if ( msg.match ) cb(msg);
    });
  }
}

SlackBot.EVENTS = EVENTS;

module.exports = SlackBot;
