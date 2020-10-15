const {Telegraf} = require('telegraf')
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

bot.command('/chatinfo', ctx => {
  ctx.replyWithMarkdown(`👻 *Chat Information:* 👻
*ID:* ${ctx.chat.id}
*Title:* ${ctx.chat.title}`)
})
bot.launch()

exports.bot = bot