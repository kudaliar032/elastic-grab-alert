require('dotenv').config()
const es = require('./elasticsearch')
const rabbit = require('./rabbitmq')
const telegram = require('./telegram')
const CronJob = require('cron').CronJob;
const chatId = process.env.TELEGRAM_CHAT_ID

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

const consumerJob = (msg, channel) => {
  const {alert} = JSON.parse(msg.content.toString())
  console.log(`New Message: ${alert.subject} | ${alert.text}`)

  telegram.bot.telegram.sendMessage(chatId, `⚠️ <b>${alert.subject}</b> ⚠️
<code>${alert.text}</code>`, {parse_mode: "HTML"}).then(() => {
    channel.ack(msg)
  }).catch(errors => {
    console.log(errors)
  })
}

const getFromEsJob = new CronJob('*/10 * * * * *', () => {
  esJob()
}, null, true, process.env.TIMEZONE)

getFromEsJob.start()
rabbit.getQueue(consumerJob)

console.log('Ready...')