'use strict'

module.exports = [{
  path: '/',
  method: 'GET',
  config: {
    tags: ['api'],
    handler: require('./handlers').index
  }
}]
