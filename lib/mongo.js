'use strict'

const mongoose = require('mongoose')
  , config = require('../config/mongo')
  , log = require('../config/log')
  , connection = mongoose.connection
  , dbUri = config[process.env.NODE_ENV]

mongoose.Promise = global.Promise
mongoose.connect(dbUri)
connection.on('error', err => log.error(`failed on mongoose conn ${err}`))
process.on('SIGINT', () => connection.close(() => process.exit(0)))
