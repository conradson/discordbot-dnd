const Discord = require('discord.js')
require('dotenv').config()
const { purse } = require('./commands')

const client = new Discord.Client()
client.on('message', function (message) {
  if (message.author.bot) return

  const args = message.content.split(' ')
  if (!args || !args.length) {
    return
  }
  const prefix = process.env.PREFIX || '!'
  const command = args.shift().toLowerCase()
  if (
    command === `${prefix}${process.env.PURSE_COMMAND || 'purse'}` ||
    (process.env.PURSE_SHORT_COMMAND &&
      command === `${prefix}${process.env.PURSE_SHORT_COMMAND}`)
  ) {
    purse(message, args)
  }
})

client.login(process.env.BOT_TOKEN)
