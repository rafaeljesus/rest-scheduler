'use strict'

const handlers = require('./handlers')

module.exports = [{
  path: '/events',
  method: 'POST',
  config: {
    tags: ['api'],
    handler: handlers.create
  }
}, {
  path: '/events/{id}',
  method: 'PUT',
  config: {
    tags: ['api'],
    handler: handlers.update
  }
}, {
  path: '/events/{id}',
  method: 'GET',
  config: {
    tags: ['api'],
    handler: handlers.show
  }
}, {
  path: '/events/{id}',
  method: 'DELETE',
  config: {
    tags: ['api'],
    handler: handlers.del
  }
}]
