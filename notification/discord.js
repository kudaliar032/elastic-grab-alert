const axios = require('axios')

const sendToChannel = (subject, text) => new Promise((resolve, reject) => {
  axios.post(process.env.DISCORD_WEBHOOK, {
    "embeds": [
      {
        "title": subject,
        "description": text,
        "color": 13565952,
        "timestamp": new Date
      }
    ]
  }).then(() => {
    resolve(true)
  }).catch(err => {
    reject(err)
  })
})

exports.sendToChannel = sendToChannel