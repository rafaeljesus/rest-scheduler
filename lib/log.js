import winston from 'winston'
import supportColors from 'supports-color'

export default new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: 'info',
      prettyPrint: true,
      colorize: supportColors,
      timestamp: true
    })
  ]
})
