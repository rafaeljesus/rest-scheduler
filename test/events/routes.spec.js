'use strict'

const Lab = require('lab')
const code = require('code')

const wrap = require('../wrap')
const Event = require('../../api/events/collection')
const server = require('../../')

const lab = exports.lab = Lab.script()
const expect = code.expect

lab.experiment('events', () => {
  let evt1
  let event = {
    cron: '* * * * *',
    url: 'https://api.github.com/users/rafaeljesus/events'
  }

  lab.beforeEach(wrap(function *() {
    evt1 = yield Event.create(event)
  }))

  lab.afterEach(wrap(function *() {
    yield Event.remove()
  }))

  lab.experiment('GET /v1/events/:id', () => {
    lab.test('should find a event by id', wrap(function *() {
      const res = yield server.injectThen({
        method: 'GET',
        url: `/v1/events/${evt1._id}`
      })
      expect(res.statusCode).to.equal(200)
    }))
  })

  lab.experiment('POST /v1/events', () => {
    lab.test('should create a event', wrap(function *() {
      evt1._id = undefined
      let newEvent = evt1

      const res = yield server.injectThen({
        method: 'POST',
        url: '/v1/events',
        payload: newEvent
      })
      expect(res.statusCode).to.equal(200)
    }))
  })

  lab.experiment('PUT /v1/events/:id', () => {
    lab.test('should update a event', wrap(function *() {
      let _id = evt1._id
      evt1._id = undefined
      evt1.url = 'https://github.com/rafaeljesus'

      const res = yield server.injectThen({
        method: 'PUT',
        url: `/v1/events/${_id}`,
        payload: evt1
      })
      expect(res.statusCode).to.equal(200)
    }))
  })

  lab.experiment('DELETE /v1/events/:id', () => {
    lab.test('should delete a event', wrap(function *() {
      const res = yield server.injectThen({
        method: 'DELETE',
        url: `/v1/events/${evt1._id}`
      })
      expect(res.statusCode).to.equal(200)
      expect(res.result).to.equal('success')
    }))
  })
})
