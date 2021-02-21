const Discord = require('discord.js')
const i18n = require('i18n')
const path = require('path')
require('dotenv').config()
const configCommand = require('./commands/config/config.command')
const purseCommand = require('./commands/purse/purse.command')
const rollCommand = require('./commands/roll/roll.command')
const pollCommand = require('./commands/poll/poll.command')
const pollRepository = require('./commands/poll/poll.repository')

i18n.configure({
  locales: ['en', 'fr'],
  directory: path.join(__dirname, '/locales'),
  defaultLocale: process.env.LOCALE_DEFAULT || 'en',
})

const client = new Discord.Client()
client.on('messageReactionAdd', (reaction, user) => {
  pollRepository.update(reaction, user, 'add')
})
client.on('messageReactionRemove', (reaction, user) => {
  pollRepository.update(reaction, user, 'remove')
})
client.on('message', async function (message) {
  const prefix = '!'
  if (message.author.bot || !message.content.startsWith(prefix)) {
    return
  }

  const args = message.content.split(' ')
  if (!args.length) {
    return
  }
  const command = args.shift().substring(prefix.length).toLowerCase()
  // TODO check if command exists

  switch (command) {
    case 'purse':
      purseCommand(message, args)
      break
    case 'roll':
      rollCommand(message, args)
      break
    case 'poll':
      pollCommand(message, args)
      break
    case 'dndbot':
      configCommand(message, args)
      break
  }
})

client.login(process.env.BOT_TOKEN)
