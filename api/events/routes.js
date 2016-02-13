'use strict'

const handlers = require('./handlers')
const validate = require('./validate')

module.exports = [{
  path: '/events',
  method: 'POST',
  config: {
    tags: ['api'],
    handler: handlers.create,
    validate: validate.create
  }
}, {
  path: '/events/{id}',
  method: 'PUT',
  config: {
    tags: ['api'],
    handler: handlers.update,
    validate: validate.update
  }
}, {
  path: '/events/{id}',
  method: 'GET',
  config: {
    tags: ['api'],
    handler: handlers.show,
    validate: validate.show
  }
}, {
  path: '/events/{id}',
  method: 'DELETE',
  config: {
    tags: ['api'],
    handler: handlers.destroy,
    validate: validate.destroy
  }
}]
