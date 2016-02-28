import Joi from 'joi'

import Event from './collection'

const id = Joi.string().required()
const schema = Joi.object({
  url: Joi.string().required(),
  cron: Joi.string().required(),
  status: Joi.only(Event.status)
})

const create = {payload: schema}
const show = {params: {id: id}}
const destroy = {params: {id: id}}
const update = {
  params: {id: id},
  payload: schema
}

export {
  create,
  update,
  show,
  destroy
}
