import Lab from 'lab'
import code from 'code'

import wrap from '../wrap'
import server from '../../'

const lab = exports.lab = Lab.script()
const expect = code.expect

lab.experiment('home', () => {
  lab.test('GET /v1', wrap(async function () {
    const res = await server.injectThen({
      method: 'GET',
      url: '/v1'
    })
    expect(res.statusCode).to.equal(200)
    expect(res.result.status).to.equal('Rest Scheduler API')
  }))
})
