'use strict'

const Joi = require('joi')

const Event = require('./collection')

const id = Joi.string().required()
const schema = Joi.object({
  url: Joi.string().required(),
  cron: Joi.string().required(),
  status: Joi.only(Event.status)
})

exports.create = {
  payload: schema
}

exports.update = {
  params: {id: id},
  payload: schema
}

exports.show = {
  params: {id: id}
}

exports.destroy = {
  params: {id: id}
}
