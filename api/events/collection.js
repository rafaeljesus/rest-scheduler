'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
