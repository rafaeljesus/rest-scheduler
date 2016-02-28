import mongoose from 'mongoose'

const Schema = mongoose.Schema

const Status = [
  'active',
  'paused'
]

const Event = Schema({
  url: {type: String, default: ''},
  cron: {type: String, default: ''},
  status: {type: String, enum: Status}
})

Event.statics.status = Status

module.exports = mongoose.model('events', Event)
