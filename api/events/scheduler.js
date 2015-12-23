'use strict'

const Promise = require('bluebird')
  , request = require('request')
  , scheduler = require('node-schedule')
  , Event = require('./collection')
  , log = require('../../config/log')

Promise.promisifyAll(request)

let scheduledEvents = {}

exports.getScheduledEvents = () => scheduledEvents

exports.resetScheduledEvents = () => {
  scheduledEvents = {}
}

exports.start = function() {
  return Event.
    findAsync().
    bind(this).
    then(docs => {
      const skip = docs.length === 0
      if (skip) return
      return Promise.each(docs, this.create)
    }).
    catch(err => log.info(`scheduler failed to start ${err}`))
}

exports.create = function(event) {
  const cron = event.cron ?
    event.cron :
    new Date(event.when)

  scheduledEvents[event._id] = scheduler.scheduleJob(cron, () => {
    return request.
      getAsync({url: event.url}).
      then(res => {
        log.info('scheduler#job sent', {
          statusCode: res.statusCode,
          body: res.body,
          headers: res.headers
        })
      }).
      catch(err => log.error(`scheduler#job failed to send ${err}`))
  })

  log.info('scheduler#job scheduled', event)
  return scheduledEvents
}

exports.cancel = function(_id) {
  let job = scheduledEvents[_id]
  if (!job) return
  job.cancel()
  delete scheduledEvents[_id]
}

exports.update = function(_id, event) {
  event._id = _id
  this.cancel(_id)
  return this.create(event)
}
