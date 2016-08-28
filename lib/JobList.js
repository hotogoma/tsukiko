const CronJob = require('cron').CronJob;

class JobList {
  constructor() {
    this.list = [];
  }

  add(cronTime, onTick, onComplete) {
    this.list.push( new CronJob(cronTime, onTick, onComplete) );
  }

  startAll() {
    this.list.map((job) => job.start());
  }
}

module.exports = JobList;
