const configModel = require('../models/config.model')

class ConfigRepository {
  async init(channelId) {
    configModel.sync()
    let config = await configModel.findOne({
      where: { channelId: channelId },
    })
    if (!config) {
      config = await configModel.create({
        channelId: channelId,
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
