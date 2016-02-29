import * as Scheduler from './scheduler'
import Event from './collection'

export {
  create,
  update,
  show,
  destroy
}

async function create (request, reply) {
  try {
    const res = await Event.create(request.payload)
    Scheduler.create(res)
    reply(res._id)
  } catch (err) {
    reply.badData(err)
  }
}

async function update (request, reply) {
  try {
    const res = await {
      event: Event.findByIdAndUpdate(request.params.id, request.payload),
      schedule: Scheduler.update(request.params.id, request.payload)
    }
    reply(res.event)
  } catch (err) {
    reply.preconditionFailed(err)
  }
}

async function show (request, reply) {
  try {
    const event = await Event.findById(request.params.id)
    if (!event) return reply.notFound('Event not found')
    reply(event)
  } catch (err) {
    reply.preconditionFailed(err)
  }
}

async function destroy (request, reply) {
  try {
    await [
      Event.remove({_id: request.params.id}),
      Scheduler.cancel(request.params.id)
    ]
    reply('success')
  } catch (err) {
    reply.preconditionFailed(err)
  }
}
