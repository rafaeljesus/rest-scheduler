'use strict'

const wrap = require('co').wrap

const Scheduler = require('./scheduler')
const Event = require('./collection')

exports.create = wrap(function *(request, reply) {
  try {
    const res = yield Event.create(request.payload)
    Scheduler.create(res)
    reply(res._id)
  } catch (err) {
    reply.badData(err)
  }
})

exports.update = wrap(function *(request, reply) {
  try {
    const res = yield {
      event: Event.findByIdAndUpdate(request.params.id, request.payload),
      schedule: Scheduler.update(request.params.id, request.payload)
    }
    reply(res.event)
  } catch (err) {
    reply.preconditionFailed(err)
  }
})

exports.show = wrap(function *(request, reply) {
  try {
    const event = yield Event.findById(request.params.id)
    if (!event) return reply.notFound('Event not found')
    reply(event)
  } catch (err) {
    reply.preconditionFailed(err)
  }
})

exports.destroy = wrap(function *(request, reply) {
  try {
    yield [
      Event.remove({_id: request.params.id}),
      Scheduler.cancel(request.params.id)
    ]
    reply('success')
  } catch (err) {
    reply.preconditionFailed(err)
  }
})
