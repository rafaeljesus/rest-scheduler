'use strict'

const supertest = require('supertest')
const mocha = require('mocha')
const coMocha = require('co-mocha')

const app = require('../../')
const request = supertest(app.listen())
const Event = require('../../api/events/collection')

coMocha(mocha)

describe('Events:RoutesSpec', () => {

  let evt1
  let event = {
    cron: '* * * * *',
    url: 'https://api.github.com/users/rafaeljesus/events'
  }

  beforeEach(function *() {
    evt1 = yield Event.create(event)
  })

  afterEach(function *() {
    yield Event.remove()
  })

  describe('GET /v1/events/:id', () => {
    it('should find a event by id', done => {
      request.
        get(`/v1/events/${evt1._id}`).
        set('Accept', 'application/json').
        expect('Content-Type', /json/).
        expect(200, done)
    })
  })

  describe('POST /v1/events', () => {
    it('should create a event', done => {
      evt1._id = undefined
      const newEvent = evt1
      request.
        post('/v1/events').
        set('Accept', 'application/json').
        send(newEvent).
        expect('Content-Type', /json/).
        expect(200, done)
    })
  })

  describe('PUT /v1/events/:id', () => {
    it('should update a event', done => {
      let _id = evt1._id
      evt1._id = undefined
      evt1.url = 'https://github.com/rafaeljesus'

      request.
        put(`/v1/events/${_id}`).
        send(evt1).
        set('Accept', 'application/json').
        expect('Content-Type', /json/).
        expect(200, done)
    })
  })

  describe('DELETE /v1/events/:id', () => {
    it('should delete a event', done => {
      request.
        delete(`/v1/events/${evt1._id}`).
        set('Accept', 'application/json').
        expect(204, done)
    })
  })
})
