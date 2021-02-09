const controler = require('./purse.controller')
const helper = require('./purse.helper')

module.exports = async (message, args) => {
  const {
    channel,
    author: { id: authorId },
  } = message
  let purse
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
  if (args.length < 1) {
    purse = await controler.load(authorId, character)
  } else if (args[0] === 'set' || args[0] === 's') {
    purse = await controler.set(
      authorId,
      character,
      args.join(' ').toLowerCase()
    )
  } else if (args[0] === 'reset' || args[0] === 'r') {
    purse = await controler.reset(authorId, character)
  } else if (args[0] === 'gain' || args[0] === 'g') {
    args.shift()
    purse = await controler.gain(
      authorId,
      character,
      args.join(' ').toLowerCase()
    )
  } else if (args[0] === 'pay' || args[0] === 'p') {
    args.shift()
    try {
      const { paid, change, update } = await controler.pay(
        authorId,
        character,
        args.join(' ').toLowerCase()
      )
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
  } else {
    channel.send(helper.invalidCommand())
    return
  }
  channel.send(helper.purseContent(helper.purseTotal(purse), character))
}
