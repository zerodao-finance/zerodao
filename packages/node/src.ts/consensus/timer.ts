"use strict";

export async function createTimer(timer_id, interval, job: () => Promise<void>) {
  Object.assign(this, {
    job,
    interval,
    timer_id
  });
}


createTimer.prototype.halt = async () => {
  clearInterval(this.interval);
}

createTimer.prototype.start = async () => {
  this.interval = setInterval(
    this.job.bind(this),
    this.interval
  )
}
