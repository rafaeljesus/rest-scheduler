'use strict'

let winston = require('winston')
let supportColors = require('supports-color')

module.exports = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: 'info',
      prettyPrint: true,
      colorize: supportColors,
      timestamp: true
    })
  ]
})
