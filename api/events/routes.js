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
    const event = this.request.body
    this.body = yield Event.
      create(event).
      then(res => {
        event._id = res._id
        Scheduler.create(event)
        return res._id
      }).
      catch(err => this.throw(422, err))
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
    const body = this.request.body
    const _id = this.params.id
    this.body = yield Event.
      findByIdAndUpdate(_id, body).
      then(res => {
        Scheduler.update(_id, body)
        return res
      }).
      catch(err => this.throw(412, err))
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
   * @apiSuccessExample {json} Sucess
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
    const _id = this.params.id
    this.body = yield Event.
      findById(_id).
      then(res => {
        if (!res) return this.throw(404)
        return res
      }).
      catch(err => this.throw(412, err))
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
    const _id = this.params.id
    yield Promise.race([
      Event.remove({_id: _id}),
      Scheduler.cancel(_id)
    ]).
    then(() => {
      this.status = 204
    }).
    catch(err => this.throw(412, err))
  })

module.exports = router
