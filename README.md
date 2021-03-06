## Rest Scheduler

[![Codeship Status for rafaeljesus/rest-scheduler](https://codeship.com/projects/5fb5b430-7864-0133-0133-4ab273700aba/status?branch=master)](https://codeship.com/projects/118570)
[![Docker Image Size](https://img.shields.io/imagelayers/image-size/rafaeljesus/rest-scheduler/latest.svg)](https://hub.docker.com/r/rafaeljesus/rest-scheduler/)
[![Docker Image Pulls](https://img.shields.io/docker/pulls/rafaeljesus/rest-scheduler.svg)](https://hub.docker.com/r/rafaeljesus/rest-scheduler/)
[![NPM version](http://img.shields.io/npm/v/rest-scheduler.svg)](https://www.npmjs.org/package/rest-scheduler)
[![bitHound Overalll Score](https://www.bithound.io/github/rafaeljesus/rest-scheduler/badges/score.svg)](https://www.bithound.io/github/rafaeljesus/rest-scheduler)
[![bitHound Dependencies](https://www.bithound.io/github/rafaeljesus/rest-scheduler/badges/dependencies.svg)](https://www.bithound.io/github/rafaeljesus/rest-scheduler/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/rafaeljesus/rest-scheduler/badges/devDependencies.svg)](https://www.bithound.io/github/rafaeljesus/rest-scheduler/master/dependencies/npm)
[![bitHound Code](https://www.bithound.io/github/rafaeljesus/rest-scheduler/badges/code.svg)](https://www.bithound.io/github/rafaeljesus/rest-scheduler)

* Handles job scheduling by storing and managing events that correspond to actions to execute in the future.

## Installation
```bash
npm install -g rest-scheduler
```

## Running tests
To run a suite tests execute:
```bash
npm test
```

## Built with
- [nodejs](https://https://nodejs.org) Backend is a nodejs latest.
- [hapijs](http://hapijs.com) API is a Hapi server. It respond to requests RESTfully in JSON.
- [Mongodb](https://www.mongodb.com) Mongodb as a data store.

## Docker
This repository has automated image builds on hub.docker.com.

Use [docker-mongodb](https://github.com/rafaeljesus/docker-mongodb) and run command described there

Finally run:
```
$ docker-machine start default
$ eval $(docker-machine env default)
$ docker run -it -e "NODE_ENV=development" -v "$(pwd)":/data --link mongo:mongo -w /data -p 3000:3000 rafaeljesus/rest-scheduler
$ curl `docker-machine ip default`:3000
```

## API
You can find how to send requests at test/ directory

## Contributing
- Fork it
- Create your feature branch (`git checkout -b my-new-feature`)
- Commit your changes (`git commit -am 'Add some feature'`)
- Push to the branch (`git push origin my-new-feature`)
- Create new Pull Request

### Maintaners

* [Rafael Jesus](https://github.com/rafaeljesus)
