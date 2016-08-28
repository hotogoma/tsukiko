const redis = require('redis');

class RedisStorage {
  constructor(redis_url) {
    this.client = redis.createClient(redis_url);
  }

  set(key, val) {
    return new Promise((resolve, reject) => {
      if ( val === undefined ) {
        this.client.del(key);
        return resolve();
      }
      this.client.set(key, JSON.stringify(val), (err, res) => {
        err ? reject(err) : resolve(res);
      });
    });
  }

  get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, val) => {
        err ? reject(err) : resolve( JSON.parse(val) );
      });
    });
  }
}

module.exports = RedisStorage;
