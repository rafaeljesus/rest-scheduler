'use strict'

const koa = require('koa')
  , kbody = require('koa-bodyparser')
  , serve = require('koa-static')
  , logger = require('koa-logger')
  , helmet = require('koa-helmet')
  , cors = require('kcors')
  , homeAPI = require('./api/home/routes')
  , eventsAPI = require('./api/events/routes')
  , app = koa()

app.use(kbody())
app.use(logger())
app.use(helmet())
app.use(cors({
  methods: ['POST', 'GET']
}))
app.use(homeAPI.routes())
app.use(eventsAPI.routes())
app.use(serve('public'))

module.exports = app
