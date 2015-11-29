'use strict'

const krouter = require('koa-router')
  , router = krouter()
  , Scheduler = require('./scheduler')
  , Event = require('./collection')

router.
  /**
   * @api {post} /v1/events Submit a job to run according to a recurring schedule
   * @apiGroup Events
   * @apiSuccess {String} cron Cron expressions: <minutes> <hours> <day of month> <month> <day of week>
   * @apiSuccess {String} url URL callback
   * @apiSuccess {String} status Status
   * @apiExample {json} Example usage:
   *    curl -X POST http://scheduler-api/v1/events \
   *    -d 'cron=0/5 * * * *' \
   *    -d 'url=http://your-server-url/run-job' \
   *    -d 'status=ACTIVE' \
   * @apiSuccessExample {json} Success
   *    HTTP/1.1 200 OK
   *    {
   *      "_id": 198789879678565,
   *      "cron": "0/5 * * * *",
   *      "url": "http://your-server-url/run-job",
   *    }
   * @apiErrorExample {json} Error
   *    HTTP/1.1 422 Unprocessable Entity
   */
  post('/v1/events', function *() {
    try {
      let event = this.request.body
      let res = yield Event.createAsync(event)
      event._id = res._id
      Scheduler.create(event)
      this.body = res._id
    } catch (err) {
      this.throw(412, err)
    }
  }).
  /**
   * @api {put} /v1/events/:id Update a Event
   * @apiGroup Events
   * @apiParam {String} cron Cron expressions: <minutes> <hours> <day of month> <month> <day of week>
   * @apiParam {String} url URL callback
   * @apiParam {String} status Status
   * @apiParamExample {json} Example usage:
   *    curl -X POST http://scheduler-api/v1/events/:id \
   *    -d 'cron=0/5 * * * *' \
   *    -d 'url=http://your-server-url/run-job' \
   *    -d 'status=ACTIVE' \
   * @apiSuccessExample {json} Success
   *    HTTP/1.1 204 No Content
   * @apiErrorExample {json} Find Error
   *    HTTP/1.1 412 Precondition Failed
   */
  put('/v1/events/:id', function *() {
    try {
      let body = this.request.body
      const _id = this.params.id
      let res = yield Event.findByIdAndUpdateAsync(_id, body)
      Scheduler.update(_id, body)
      this.body = res
    } catch (err) {
      console.log(err)
      this.throw(412, err)
    }
  }).
  /**
   * @api {get} /v1/events/:id Get detailed info about event
   * @apiGroup Events
   * @apiParam {id} id Event Id
   * @apiSuccess {String} _id Event Id
   * @apiSuccess {String} cron Cron expression
   * @apiSuccess {String} url URL callback
   * @apiSuccess {String} status Status
   * @apiExample {json} Example usage:
   *    curl -X GET http://scheduler-api/v1/events/:id \
   * @apiSuccessExample {json} Sucesso
   *    HTTP/1.1 200 OK
   *    {
   *      "_id": 198789879678565,
   *      "cron": "0/5 * * * *",
   *      "url": "http://your-server-url/run-job",
   *    }
   * @apiErrorExample {json} Event not Found
   *    HTTP/1.1 404 Not Found
   * @apiErrorExample {json} Find Error
   *    HTTP/1.1 412 Precondition Failed
   */
  get('/v1/events/:id', function *() {
    try {
      const _id = this.params.id
      this.body = yield Event.findByIdAsync(_id)
    } catch (err) {
      this.throw(412, err)
    }
  }).
  /**
   * @api {delete} /v1/events/:id Exclude a event
   * @apiGroup Events
   * @apiParam {id} id Event Id
   * @apiExample {json} Example usage:
   *    curl -X DELETE http://scheduler-api/v1/events/:id \
   * @apiSuccessExample {json} Success
   *    HTTP/1.1 204 No Content
   * @apiErrorExample {json} Find Error
   *    HTTP/1.1 412 Precondition Failed
   */
  delete('/v1/events/:id', function *() {
    try {
      const _id = this.params.id
      yield [
        Event.removeAsync({_id: _id}),
        Scheduler.cancel(_id)
      ]
      this.status = 204
    } catch (err) {
      this.throw(412, err)
    }
  })

module.exports = router
