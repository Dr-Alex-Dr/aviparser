// 5083525269:AAFJysIT_nbA-UKv0qR7aGQuC9e2p_arLMM
const { Telegraf } = require('telegraf')

const bot = new Telegraf("5083525269:AAFJysIT_nbA-UKv0qR7aGQuC9e2p_arLMM")
bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
