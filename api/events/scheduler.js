'use strict'

const wrap = require('co').wrap
const request = require('request')
const scheduler = require('node-schedule')

const Event = require('./collection')
const log = require('../../lib/log')

let scheduledEvents = {}

exports.getScheduledEvents = () => scheduledEvents

exports.resetScheduledEvents = () => {
  scheduledEvents = {}
}

exports.start = wrap(function *() {
  try {
    let docs = yield Event.find()
    const skip = docs.length === 0
    if (skip) return
    yield Promise.all(docs.map(this.create))
  } catch (err) {
    log.info(`scheduler failed to start ${err}`)
  }
})

exports.create = function (event) {
  const cron = event.cron
    ? event.cron
    : new Date(event.when)

  scheduledEvents[event._id] = scheduler.scheduleJob(cron, () => {
    const options = {url: event.url}
    return request.get(options, (err, res) => {
      return new Promise((resolve, reject) => {
        if (err) {
          log.info(`scheduler#job failed to send ${err}`)
          return reject(err)
        }

        log.info('scheduler#job sent', {
          statusCode: res.statusCode,
          body: res.body,
          headers: res.headers
        })
        resolve(res.body)
      })
    })
  })

  log.info('scheduler#job scheduled', event.toObject ? event.toObject() : event)
  return scheduledEvents
}

exports.cancel = function (_id) {
  let job = scheduledEvents[_id]
  if (!job) return
  job.cancel()
  delete scheduledEvents[_id]
}

exports.update = function (_id, event) {
  event._id = _id
  this.cancel(_id)
  return this.create(event)
}
