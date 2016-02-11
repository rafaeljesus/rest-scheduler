'use strict'

const wrap = require('co').wrap
const Boom = require('boom')

const Scheduler = require('./scheduler')
const Event = require('./collection')

exports.create = wrap(function *(request, reply) {
  try {
    const res = yield Event.create(request.payload)
    Scheduler.create(res)
    reply(res._id)
  } catch (err) {
    reply(Boom.wrap(err), 422)
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
    reply(Boom.wrap(err), 412)
  }
})

exports.show = wrap(function *(request, reply) {
  try {
    const event = yield Event.findById(request.params.id)
    if (!event) return Boom.notFound('Event not found')
    reply(event)
  } catch (err) {
    reply(Boom.wrap(err), 412)
  }
})

exports.del = wrap(function *(request, reply) {
  try {
    yield [
      Event.remove({_id: request.params.id}),
      Scheduler.cancel(request.params.id)
    ]
    reply('success')
  } catch (err) {
    reply(Boom.wrap(err), 412)
  }
})
