'use strict'

const cluster = require('cluster')
const CPUS = require('os').cpus()

const Scheduler = require('./api/events/scheduler')
const log = require('./lib/log')

if (cluster.isMaster) {
  CPUS.forEach(() => cluster.fork())

  cluster.on('listening', (worker) => log.info(`Worker ${worker.process.pid} connected`))
  cluster.on('disconnect', (worker) => log.info(`Worker ${worker.process.pid} disconnect`))
  cluster.on('exit', (worker) => {
    log.info(`Worker ${worker.process.pid} exited`)
    cluster.fork()
  })
}

if (cluster.isWorker) {
  require('./bin/www')
  require('./lib/mongo')

  if (cluster.worker.id === 1) {
    const startJobs = function *() {
      yield Scheduler.start()
    }
    startJobs().next()
  }
}
