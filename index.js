const express = require('express')
const Discord = require('discord.js')
require('dotenv').config()
const { purse } = require('./commands')
const app = express()

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`DnDbot is running on port ${PORT}`)
})

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
