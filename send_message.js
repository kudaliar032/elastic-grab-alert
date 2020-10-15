require('dotenv').config()
const rabbit = require('./rabbitmq')

rabbit.sendQueue(JSON.stringify({
  "@timestamp": "2020-10-15T02:44:25.615Z",
  alert: {
    subject: "CPU Alert on [server]",
    name: "DOT: High CPU Alert",
    text: "CPU usage is greater than a threshold of 95 (current value is 100%)"
  }
}))