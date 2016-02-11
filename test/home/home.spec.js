'use strict'

const Lab = require('lab')
const code = require('code')

const wrap = require('../wrap')
const server = require('../../')

const lab = exports.lab = Lab.script()
const expect = code.expect

lab.experiment('home', () => {
  lab.test('GET /v1', wrap(function *() {
    const res = yield server.injectThen({
      method: 'GET',
      url: '/v1'
    })
    expect(res.statusCode).to.equal(200)
    expect(res.result.status).to.equal('Rest Scheduler API')
  }))
})
