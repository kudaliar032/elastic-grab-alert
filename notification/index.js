const telegram = require('./telegram')
const discord = require('./discord')

const chatId = process.env.TELEGRAM_CHAT_ID

const sendTelegram = (subject, text) => new Promise(((resolve, reject) => {
  telegram.bot.telegram.sendMessage(chatId, `⚠️ <b>${subject}</b> ⚠️\n${text}`, {parse_mode: "HTML"}).then(() => {
    resolve(true)
  }).catch(errors => {
    reject(errors)
  })
}))

const sendDiscord = (subject, text) => new Promise((resolve, reject) => {
  discord.sendToChannel(subject, text).then(res => resolve(res)).catch(err => reject(err))
})

const sendNotification = async (msg, channel) => {
  try {
    const {alert} = JSON.parse(msg.content.toString())
    const {subject, text} = alert

    const [telegram, discord] = await Promise.all([
      sendTelegram(subject, text),
      sendDiscord(subject, text)
    ])

    if (telegram && discord) {
      channel.ack(msg)
      console.log(`New Message: ${alert.subject} | ${alert.text}`)
    } else {
    }
  } catch (e) {
    throw e
  }
}

module.exports = sendNotification