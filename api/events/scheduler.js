import request from 'request'
import scheduler from 'node-schedule'

import Event from './collection'
import log from '../../lib/log'

let scheduledEvents = {}

export {
  start,
  create,
  cancel,
  update,
  getScheduledEvents,
  resetScheduledEvents
}

async function start () {
  try {
    let docs = await Event.find()
    const skip = docs.length === 0
    if (skip) return
    await Promise.all(docs.map(create))
  } catch (err) {
    log.info(`scheduler failed to start ${err}`)
  }
}

function create (event) {
  const cron = event.cron
    ? event.cron
    : new Date(event.when)

  scheduledEvents[event._id] = scheduler.scheduleJob(cron, async function () {
    await sendRequest({url: event.url})
  })

  log.info('scheduler#job scheduled', {
    _id: event.id,
    status: event.status,
    cron: event.cron,
    url: event.url
  })
  return scheduledEvents
}

function cancel (_id) {
  let job = scheduledEvents[_id]
  if (!job) return
  job.cancel()
  delete scheduledEvents[_id]
}

function update (_id, event) {
  event._id = _id
  cancel(_id)
  return create(event)
}

function getScheduledEvents () {
  return scheduledEvents
}

function resetScheduledEvents () {
  scheduledEvents = {}
}

function sendRequest (options) {
  return new Promise((resolve, reject) => {
    request.get(options, (err, res) => {
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
}
