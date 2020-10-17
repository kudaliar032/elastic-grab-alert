require('dotenv').config()
const es = require('./elasticsearch')
const rabbit = require('./rabbitmq')
const notification = require('./notification')
const CronJob = require('cron').CronJob;

const esJob = async () => {
  try {
    const results = await es.getLatest('10s')
    results.map(val => {
      rabbit.sendQueue(JSON.stringify(val._source))
    })
  } catch (e) {
    console.log(e)
  }
}

const getFromEsJob = new CronJob('*/10 * * * * *', () => {
  esJob()
}, null, true, process.env.TIMEZONE)

getFromEsJob.start()
rabbit.getQueue(notification)

console.log('Ready...')