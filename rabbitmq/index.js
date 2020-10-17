const amqp = require('amqplib/callback_api')
const queue = process.env.AMQP_QUEUE

const sendQueue = msg => {
  try {
    amqp.connect(process.env.AMQP_URL, (error0, connection) => {
      if (error0) throw error0
      connection.createChannel((error1, channel) => {
        if (error1) throw error1
        channel.assertQueue(queue, {durable: false})
        channel.sendToQueue(queue, Buffer.from(msg), {persistent: true})
        setTimeout(() => {connection.close()}, 500)
      })
    })
  } catch (e) {
    console.log(e)
  }
}

const getQueue = job => {
  try {
    amqp.connect(process.env.AMQP_URL, (error0, connection) => {
      if (error0) throw error0
      connection.createChannel((error1, channel) => {
        if (error1) throw error1
        channel.assertQueue(queue, {durable: false})
        channel.prefetch(1)
        channel.consume(queue, msg => {
          setTimeout(() => {
            job(msg, channel)
          }, 1000)
        }, {
          noAck: false
        })
      })
    })
  } catch (e) {
    console.log(e)
  }
}

exports.sendQueue = sendQueue
exports.getQueue = getQueue