const configModel = require('./config.model')

class ConfigRepository {
  async init(guildId) {
    await configModel.sync()
    let config = await configModel.findOne({
      where: { guildId: guildId },
    })
    if (!config) {
      config = await configModel.create({
        guildId: guildId,
      })
    }

    this.config = config
  }

  getLocale() {
    return this.config.locale
  }

  async setLocale(locale) {
    this.config.locale = locale
    await this.config.save()
  }
}

module.exports = new ConfigRepository()
