import Lab from 'lab'
import code from 'code'

import wrap from '../wrap'
import Event from '../../api/events/collection'
import * as Scheduler from '../../api/events/scheduler'

const lab = exports.lab = Lab.script()
const expect = code.expect

require('../../lib/mongo')

lab.experiment('scheduler', () => {
  let event = {
    cron: '* * * * *',
    url: 'https://api.github.com/users/rafaeljesus/events'
  }

  lab.afterEach((done) => {
    Scheduler.resetScheduledEvents()
    done()
  })

  lab.experiment('.start', () => {
    lab.beforeEach(wrap(async function () {
      await Event.create(event)
      await Scheduler.start()
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
  })

  lab.experiment('.update', () => {
    lab.beforeEach((done) => {
      event._id = 'foo'
      Scheduler.create(event)
      event.cron = '1 * * * *'
      Scheduler.update(event._id, event)
      done()
    })

    lab.test('should have one scheduled running jobs', (done) => {
      const running = Scheduler.getScheduledEvents()
      const len = Object.keys(running).length
      expect(len).to.equal(1)
      expect(running).to.exist()
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
      expect(running[event._id]).to.not.exist()
      expect(len).to.equal(0)
      done()
    })
  })
})
