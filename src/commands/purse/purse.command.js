const configRepository = require('../../repositories/config.repository')
const purseRepository = require('../../repositories/purse.repository')
const locales = require('./purse.locales')
const PurseHelper = require('./purse.helper')

module.exports = async (message, args) => {
  const {
    channel,
    author: { id: authorId },
  } = message
  const { id: channelId } = channel
  await configRepository.init(channelId)
  const locale = await configRepository.getLocale()
  const helper = new PurseHelper(locales[locale])
  if (args.length < 1 || args[0] === 'help' || args[0] === 'h') {
    channel.send(helper.help())
    return
  }
  const character = args.shift().toLowerCase()
  const reserved = ['set', 's', 'reset', 'r', 'pay', 'p', 'gain', 'g']
  if (reserved.includes(character)) {
    channel.send(helper.noCharacterSelected())
    return
  }
  await purseRepository.init(authorId, character, locales[locale], helper)

  const amount = args.join(' ').toLowerCase()
  let purse = purseRepository.purse
  if (args[0] === 'set' || args[0] === 's') {
    purse = await purseRepository.set(amount)
  } else if (args[0] === 'reset' || args[0] === 'r') {
    purse = await purseRepository.reset()
  } else if (args[0] === 'gain' || args[0] === 'g') {
    args.shift()
    purse = await purseRepository.gain(amount)
  } else if (args[0] === 'pay' || args[0] === 'p') {
    args.shift()
    try {
      const { paid, change, update } = await purseRepository.pay(amount)
      channel.send(
        `${helper.purseTransaction(
          helper.purseTotal(paid),
          helper.purseTotal(change),
          character
        )}\n${helper.purseContent(helper.purseTotal(update), character)}`
      )
    } catch (error) {
      channel.send(helper.notEnoughMoney(character))
    }
    return
  } else if (args.length > 0) {
    channel.send(helper.invalidCommand())
    return
  }
  channel.send(helper.purseContent(helper.purseTotal(purse), character))
}
