'use strict'

const krouter = require('koa-router')
  , router = krouter()
/**
 * @api {get} / API Status
 * @apiGroup Status
 * @apiSuccess {String} status API status message
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "Scheduler API"
 *    }
 */
router.
  get('/', function *() {
    this.status = 200
    this.body = {status: 'Scheduler API'}
  })

module.exports = router
