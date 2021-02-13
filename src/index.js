const Discord = require('discord.js')
require('dotenv').config()
const { config, purse } = require('./commands')

const client = new Discord.Client()
client.on('message', function (message) {
  if (message.author.bot) return

  const prefix = '!'
  const args = message.content.split(' ')
  if (!args.length || !args[0].startsWith(prefix)) {
    return
  }
  const command = args.shift().substring(prefix.length).toLowerCase()
  switch (command) {
    case 'purse':
    case 'p':
      purse(message, args)
      break
    case 'dndbot':
      config(message, args)
      break
  }
})

client.login(process.env.BOT_TOKEN)
