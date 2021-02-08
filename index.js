const Discord = require('discord.js')
const purse = require('./commands/purse.command')
require('dotenv').config()
const client = new Discord.Client()

client.on('message', function (message) {
  if (message.author.bot) return

  const args = message.content.split(' ')
  if (!args || !args.length) {
    return
  }
  const command = args.shift().toLowerCase()

  if (command === `${process.env.PREFIX}purse`) {
    purse(message, args)
  }
})

client.login(process.env.BOT_TOKEN)
