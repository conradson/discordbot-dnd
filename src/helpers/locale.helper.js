const i18n = require('i18n')
require('dotenv').config()
const configRepository = require('../commands/config/config.repository')

exports.getLocale = async (message) => {
  const { guild } = message
  if (guild) {
    await configRepository.init(guild.id)
    return configRepository.getLocale()
  }
  return process.env.LOCALE_DEFAULT || 'en'
}

exports.localize = (phrase, locale, ...args) => {
  return i18n.__({ phrase, locale }, ...args)
}
