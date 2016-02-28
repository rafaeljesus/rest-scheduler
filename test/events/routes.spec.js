import Lab from 'lab'
import code from 'code'

import wrap from '../wrap'
import Event from '../../api/events/collection'
import server from '../../'

const lab = exports.lab = Lab.script()
const expect = code.expect

require('../../lib/mongo')

lab.experiment('events', () => {
  let evt1
  let event = {
    cron: '* * * * *',
    url: 'https://api.github.com/users/rafaeljesus/events',
    status: 'active'
  }

  lab.beforeEach(wrap(async function () {
    evt1 = await Event.create(event)
  }))

  lab.afterEach(wrap(async function () {
    await Event.remove()
  }))

  lab.experiment('GET /v1/events/:id', () => {
    lab.test('should find a event by id', wrap(async function () {
      const res = await server.injectThen({
        method: 'GET',
        url: `/v1/events/${evt1._id}`
      })
      expect(res.statusCode).to.equal(200)
    }))
  })

  lab.experiment('POST /v1/events', () => {
    lab.test('should create a event', wrap(async function () {
      const res = await server.injectThen({
        method: 'POST',
        url: '/v1/events',
        payload: {
          url: evt1.url,
          cron: evt1.cron,
          status: evt1.status
        }
      })
      expect(res.statusCode).to.equal(200)
    }))
  })

  lab.experiment('PUT /v1/events/:id', () => {
    lab.test('should update a event', wrap(async function () {
      const res = await server.injectThen({
        method: 'PUT',
        url: `/v1/events/${evt1._id}`,
        payload: {
          url: 'https://github.com/rafaeljesus',
          cron: evt1.cron,
          status: evt1.status
        }
      })
      expect(res.statusCode).to.equal(200)
    }))
  })

  lab.experiment('DELETE /v1/events/:id', () => {
    lab.test('should delete a event', wrap(async function () {
      const res = await server.injectThen({
        method: 'DELETE',
        url: `/v1/events/${evt1._id}`
      })
      expect(res.statusCode).to.equal(200)
      expect(res.result).to.equal('success')
    }))
  })
})
