'use strict'

const Promise = require('bluebird')
  , request = Promise.promisifyAll(require('request'))
  , scheduler = require('node-schedule')
  , Event = require('./collection')

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
    catch(err => {
      console.log('scheduler failed to start', err)
    })
}

exports.create = function(event) {
  const cron = event.cron ?
    event.cron :
    new Date(event.when)

  scheduledEvents[event._id] = scheduler.scheduleJob(cron, () => {
    return request.
      getAsync({url: event.url}).
      then(res => {
        console.log('scheduler#job sent', {
          statusCode: res.statusCode,
          body: res.body,
          headers: res.headers
        })
      }).
      catch(err => console.error('scheduler#job failed to send', err))
  })

  console.log('scheduler#job scheduled', event)
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
