'use strict'

const supertest = require('supertest')
  , app = require('../../')
  , request = supertest(app.listen())
  , Event = require('../../api/events/collection')

describe('Events:RoutesSpec', () => {

  let evt1
  let event = {
    cron: '* * * * *',
    url: 'https://api.github.com/users/rafaeljesus/events'
  }

  beforeEach(() => {
    return Event.
      createAsync(event).
      then(doc => {
        evt1 = doc
      })
  })

  afterEach(() => Event.removeAsync())

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
