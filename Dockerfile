FROM node:5

ADD . /rest-scheduler

WORKDIR /rest-scheduler

RUN npm i --production

CMD ["npm", "start"]
