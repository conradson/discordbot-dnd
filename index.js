const Discord = require('discord.js')
const purse = require('./commands/purse.command')
require('dotenv').config()
const client = new Discord.Client()

const { BOT_TOKEN, PREFIX } = process.env

client.on('message', function (message) {
  if (message.author.bot) return

  const args = message.content.split(' ')
  if (!args || !args.length) {
    return
  }
  const command = args.shift().toLowerCase()

  if (command === `${PREFIX}purse`) {
    purse(message, args)
  }
})

client.login(BOT_TOKEN)
