const kuromoji = require('kuromoji');
const fs = require('fs');

const KUROMOJI_DIC_PATH = require.resolve('kuromoji').replace(/(\/node_modules\/kuromoji\/).*$/, '$1dict');

class KuromojiMiddleware {
  constructor(dicPath) {
    dicPath = this._filterAvailablePaths([ dicPath, KUROMOJI_DIC_PATH ])[0];
    this._tokenizer = new Promise((resolve, reject) => {
      kuromoji.builder({ dicPath }).build((err, tokenizer) => {
        err ? reject(err) : resolve(tokenizer);
      });
    });
  }

  _filterAvailablePaths(paths) {
    if ( ! Array.isArray(paths) ) paths = Array.prototype.slice.call(arguments);
    return paths.filter((path) => {
      try { fs.statSync(path); }
      catch(e) { return false; }
      return true;
    });
  }

  onReceive(msg, next, error) {
    if ( msg.tokenized !== undefined || ! msg.text ) next(msg);
    this._tokenizer.then((tokenizer) => {
      msg.tokenized = tokenizer.tokenize( msg.text );
      next(msg);
    }).catch(error);
  }
}

module.exports = KuromojiMiddleware;
