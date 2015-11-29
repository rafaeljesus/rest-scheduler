'use strict'

module.exports = {
  test: 'mongodb://localhost/scheduler_test',
  development: 'mongodb://localhost/scheduler',
  production: process.env.MONGOHQ_URL
}
