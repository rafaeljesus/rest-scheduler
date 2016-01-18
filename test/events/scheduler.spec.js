'use strict'

const scheduler = require('node-schedule')
  , chai = require('chai')
  , sinon = require('sinon')
  , sinonAsPromised = require('sinon-as-promised')
  , sinonChai = require('sinon-chai')
  , Event = require('../../api/events/collection')
  , Scheduler = require('../../api/events/scheduler')
  , expect = chai.expect

chai.use(sinonChai)
sinonAsPromised(require('bluebird'))

describe('Events:SchedulerSpec', () => {

  let scheduleJobSpy
  let event = {
    cron: '* * * * *',
    url: 'https://api.github.com/users/rafaeljesus/events'
  }

  beforeEach(() => {
    scheduleJobSpy = sinon.spy(scheduler, 'scheduleJob')
  })

  afterEach(() => {
    scheduleJobSpy.restore()
    Scheduler.resetScheduledEvents()
  })

  describe('.start', () => {

    beforeEach(() => {
      return Event.
        create(event).
        then(() => Scheduler.start())
    })

    it('should schedule one job', () => {
      expect(Scheduler.getScheduledEvents()).to.be.ok
    })
  })

  describe('.create', () => {

    beforeEach(() => {
      event._id = 'foo'
      Scheduler.create(event)
    })

    it('should have one scheduled running jobs', () => {
      const running = Scheduler.getScheduledEvents()
      const len = Object.keys(running).length
      expect(len).to.equal(1)
      expect(running).to.be.ok
    })

    it('should schedule new event', () => {
      expect(scheduleJobSpy).to.have.been.calledWith(event.cron)
    })
  })

  describe('.update', () => {

    beforeEach(() => {
      event._id = 'foo'
      Scheduler.create(event)
    })

    it('should update scheduled event', () => {
      event.cron = '1 * * * *'
      Scheduler.update(event._id, event)
      expect(scheduleJobSpy).to.have.been.calledWith(event.cron)
    })

    it('should have one scheduled running jobs', () => {
      const running = Scheduler.getScheduledEvents()
      const len = Object.keys(running).length
      expect(len).to.equal(1)
      expect(running).to.be.ok
    })
  })

  describe('.cancel', () => {

    beforeEach(() => {
      event._id = 'foo'
      Scheduler.create(event)
    })

    it('should cancel a scheduled job', () => {
      Scheduler.cancel(event._id)
      const running = Scheduler.getScheduledEvents()
      const len = Object.keys(running).length
      expect(running[event._id]).to.not.exist
      expect(len).to.equal(0)
    })
  })

})
