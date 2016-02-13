'use strict'

const Hapi = require('hapi')
const good = require('good')
const GoodWinstonReporter = require('good-winston-reporter')

const server = new Hapi.Server({
  debug: {
    request: ['error', 'validation']
  },
  connections: {
    router: {
      stripTrailingSlash: true
    },
    routes: {
      response: {
        modify: true,
        failAction: 'error'
      }
    }
  }
})

server.connection({
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost'
})

server.register({
  register: require('hapi-router'),
  options: {
    routes: '**/*routes.js',
    ignore: 'node_modules/**'
  }
}, {
  routes: {prefix: '/v1'}
}, (err) => {
  if (err) throw err
})

server.register({
  register: require('hapi-boom-decorators')
}, (err) => {
  if (err) throw err
})

if (process.env.NODE_ENV === 'test') {
  server.register(require('inject-then'), (err) => {
    if (err) throw err
  })
}

server.register({
  register: good,
  options: {
    reporters: [{
      reporter: GoodWinstonReporter,
      events: {
        ops: 'verbose',
        request: 'debug',
        response: 'debug',
        log: 'info',
        error: 'error'
      },
      config: {
        logger: require('./lib/log')
      }
    }]
  }
}, (err) => {
  if (err) throw err
})

module.exports = server
