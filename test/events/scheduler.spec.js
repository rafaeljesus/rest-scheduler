'use strict'

const scheduler = require('node-schedule')
const Lab = require('lab')
const code = require('code')
const sinon = require('sinon')
const sinonAsPromised = require('sinon-as-promised')

const Event = require('../../api/events/collection')
const Scheduler = require('../../api/events/scheduler')
const wrap = require('../wrap')

const lab = exports.lab = Lab.script()
const expect = code.expect

sinonAsPromised(Promise)

lab.experiment('scheduler', () => {
  let scheduleJobSpy
  let event = {
    cron: '* * * * *',
    url: 'https://api.github.com/users/rafaeljesus/events'
  }

  lab.beforeEach((done) => {
    scheduleJobSpy = sinon.spy(scheduler, 'scheduleJob')
    done()
  })

  lab.afterEach((done) => {
    scheduleJobSpy.restore()
    Scheduler.resetScheduledEvents()
    done()
  })

  lab.experiment('.start', () => {
    lab.beforeEach(wrap(function *() {
      yield Event.create(event)
      yield Scheduler.start()
    }))

    lab.test('should schedule one job', (done) => {
      expect(Scheduler.getScheduledEvents()).to.be.an.object()
      done()
    })
  })

  lab.experiment('.create', () => {
    lab.beforeEach((done) => {
      event._id = 'foo'
      Scheduler.create(event)
      done()
    })

    lab.test('should have one scheduled running jobs', (done) => {
      const running = Scheduler.getScheduledEvents()
      const len = Object.keys(running).length
      expect(len).to.equal(1)
      expect(running).to.be.an.object()
      done()
    })

    lab.test('should schedule new event', (done) => {
      expect(scheduleJobSpy.calledWith(event.cron))
      done()
    })
  })

  lab.experiment('.update', () => {
    lab.beforeEach((done) => {
      event._id = 'foo'
      Scheduler.create(event)
      done()
    })

    lab.test('should update scheduled event', (done) => {
      event.cron = '1 * * * *'
      Scheduler.update(event._id, event)
      expect(scheduleJobSpy.calledWith(event.cron))
      done()
    })

    lab.test('should have one scheduled running jobs', (done) => {
      const running = Scheduler.getScheduledEvents()
      const len = Object.keys(running).length
      expect(len).to.equal(1)
      expect(running).to.be.ok
      done()
    })
  })

  lab.experiment('.cancel', () => {
    lab.beforeEach((done) => {
      event._id = 'foo'
      Scheduler.create(event)
      done()
    })

    lab.test('should cancel a scheduled job', (done) => {
      Scheduler.cancel(event._id)
      const running = Scheduler.getScheduledEvents()
      const len = Object.keys(running).length
      expect(running[event._id]).to.not.exist
      expect(len).to.equal(0)
      done()
    })
  })
})
