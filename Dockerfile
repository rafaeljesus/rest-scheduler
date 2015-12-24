FROM node:5

ADD . /rest-scheduler

WORKDIR /rest-scheduler

RUN npm i --production

ENV NODE_ENV=production

CMD ["npm", "start"]
