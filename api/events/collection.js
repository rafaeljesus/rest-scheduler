'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.Promise = global.Promise

const Status = [
  'active',
  'paused'
]

const Event = Schema({
  url: {type: String, default: ''},
  cron: {type: String, default: ''},
  status: {type: String, enum: Status}
})

module.exports = mongoose.model('events', Event)
