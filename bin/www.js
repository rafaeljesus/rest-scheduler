'use strict'

const http = require('http')
  , Scheduler = require('../api/events/scheduler')
  , app = require('../')
  , port = process.env.PORT || 3000

require('../lib/mongo')

Scheduler.start()

http.globalAgent.maxSockets = Infinity
http.createServer(app.callback())
app.listen(port)
console.log(`Scheduler API - port ${port}`)
