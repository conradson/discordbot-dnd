const configRepository = require('./config.repository')

module.exports = async (message, args) => {
  const {
    channel,
    guild: { id: guildId },
    member,
  } = message

  if (!member.hasPermission('MANAGE_GUILD')) {
    channel.send('TODO permission denied')
    return
  }

  if (args.length < 1 || args[0] === 'help' || args[0] === 'h') {
    channel.send('TODO help')
    return
  }
  const setting = args.shift().toLowerCase()
  const commandsLocale = ['l', 'locale']
  if (!commandsLocale.includes(setting)) {
    // TODO error
    return
  }

  await configRepository.init(guildId)
  const value = args.length > 0 ? args.shift().toLowerCase() : null
  if (commandsLocale.includes(setting)) {
    if (!value) {
      channel.send(`TODO locale is ${configRepository.getLocale()}`)
    } else if (['en', 'fr'].includes(value)) {
      await configRepository.setLocale(value)
      channel.send(`TODO locale set to ${configRepository.getLocale()}`)
    } else {
      channel.send('TODO invalid locale')
    }
  }
}
