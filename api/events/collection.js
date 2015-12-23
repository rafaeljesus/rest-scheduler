'use strict'

const Promise = require('bluebird')
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema

Promise.promisifyAll(mongoose)

const Status = [
  'ACTIVE',
  'PAUSED'
]

const Event = Schema({
  url: {type: String, default: ''},
  cron: {type: String, default: ''},
  status: {type: String, enum: Status}
})

module.exports = mongoose.model('events', Event)
