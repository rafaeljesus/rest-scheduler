'use strict'

const co = require('co')

module.exports = (gen) => {
  return (done) => {
    co(gen.bind(gen))
    .then((res) => done(null, res))
    .catch((err) => done(err))
  }
}
