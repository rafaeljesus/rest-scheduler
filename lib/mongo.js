'use strict'

const mongoose = require('mongoose')

const config = require('../config/mongo')
const log = require('../lib/log')

const connection = mongoose.connection
const dbUri = config[process.env.NODE_ENV]

connection.on('error', (err) => log.error(`failed on mongoose conn ${err}`))
process.on('SIGINT', () => connection.close(() => process.exit(0)))

module.exports = (() => mongoose.connect(dbUri))()
