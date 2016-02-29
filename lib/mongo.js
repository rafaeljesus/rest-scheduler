import mongoose from 'mongoose'

import config from '../config/mongo'
import log from '../lib/log'

const connection = mongoose.connection
const dbUri = config[process.env.NODE_ENV]

mongoose.connect(dbUri)

connection.once('open', () => log.info('started mongoose connection'))
connection.on('error', (err) => log.error(`failed on mongoose conn ${err}`))
process.on('SIGINT', () => connection.close(() => process.exit(0)))
