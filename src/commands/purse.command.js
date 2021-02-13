const i18n = require('i18n')
const { capitalize } = require('../helpers/string.helper')
const purseRepository = require('../repositories/purse.repository')
const purseHelper = require('../helpers/purse.helper')

module.exports = async (message, args) => {
  const {
    channel,
    author: { id: authorId },
  } = message
  if (args.length < 1 || args[0] === 'help' || args[0] === 'h') {
    channel.send(
      i18n.__(
        "You need to begin all your commands with your character's name (without spaces), eg: `!purse hagark`\n\nCommand list:\n- see the content of your purse, eg: `!purse *name*`\n- **s**et: set your purse to a specific amount, eg: `!purse *name* s 6gp 13sp 52cp`\n- **r**eset: empty your purse, eg: `!purse *name* r`\n- **g**ain: add money to your purse, eg: `!purse *name* g 2gp 1sp`\n- **p**ay: pay an amount with your purse, eg: `!purse *name* p 23sp 7cp`"
      )
    )
    return
  }
  const character = capitalize(args.shift().toLowerCase())
  const reserved = ['set', 's', 'reset', 'r', 'pay', 'p', 'gain', 'g']
  if (reserved.includes(character.toLowerCase())) {
    channel.send(
      i18n.__('Please specify your character name, eg: `!purse hagark`')
    )
    return
  }
  await purseRepository.init(authorId, character)

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
        `${purseHelper.purseTransaction(
          purseHelper.purseTotal(paid),
          purseHelper.purseTotal(change),
          character
        )}\n${purseHelper.purseContent(
          purseHelper.purseTotal(update),
          character
        )}`
      )
    } catch (error) {
      channel.send(i18n.__("%s doesn't have enough money.", character))
    }
    return
  } else if (args.length > 0) {
    channel.send(
      i18n.__(
        'Invalid command, use one of the following: set, reset, gain, pay'
      )
    )
    return
  }
  channel.send(
    purseHelper.purseContent(purseHelper.purseTotal(purse), character)
  )
}
