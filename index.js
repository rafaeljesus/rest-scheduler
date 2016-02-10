'use strict'

const koa = require('koa')
const kbody = require('koa-bodyparser')
const serve = require('koa-static')
const logger = require('koa-logger')
const helmet = require('koa-helmet')
const cors = require('kcors')

const homeAPI = require('./api/home/routes')
const eventsAPI = require('./api/events/routes')
const app = koa()

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
