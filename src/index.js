const Discord = require('discord.js')
const i18n = require('i18n')
const path = require('path')
require('dotenv').config()
const configRepository = require('./repositories/config.repository')
const configCommand = require('./commands/config.command')
const purseCommand = require('./commands/purse.command')

i18n.configure({
  locales: ['en', 'fr'],
  directory: path.join(__dirname, '/locales'),
})

const client = new Discord.Client()
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

  await setLocale(message)

  switch (command) {
    case 'purse':
    case 'p':
      purseCommand(message, args)
      break
    case 'dndbot':
      configCommand(message, args)
      break
  }
})

async function setLocale(message) {
  const {
    channel: { id: channelId },
  } = message
  await configRepository.init(channelId)
  const locale = await configRepository.getLocale()
  i18n.setLocale(locale)
}

client.login(process.env.BOT_TOKEN)
