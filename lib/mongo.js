'use strict'

const mongoose = require('mongoose')
  , config = require('../config/mongo')
  , dbUri = config[process.env.NODE_ENV]

mongoose.connect(dbUri)

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    process.exit(0)
  })
})

mongoose.connection.on('error', err => {
  console.log('Mongoose! connection error: ' + err);
})
