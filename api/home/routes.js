import * as handlers from './handlers'

export default [{
  path: '/',
  method: 'GET',
  config: {
    tags: ['api'],
    handler: handlers.index
  }
}]
