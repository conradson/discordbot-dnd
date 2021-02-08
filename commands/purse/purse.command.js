const { load, reset, gain, pay, set } = require('./purse.controller')
const {
  purseTotal,
  purseContent,
  purseTransaction,
  notEnoughMoney,
} = require('./purse.helper')

module.exports = async (message, args) => {
  const {
    channel,
    author: { id: authorId, username },
  } = message
  let purse
  if (!args || args.length < 1) {
    purse = await load(authorId)
  } else if (args[0] === 'reset' || args[0] === 'r') {
    purse = await reset(authorId)
  } else if (args[0] === 'gain' || args[0] === 'g') {
    args.shift()
    purse = await gain(authorId, args.join(' ').toLowerCase())
  } else if (args[0] === 'pay' || args[0] === 'p') {
    args.shift()
    try {
      const { paid, change, update } = await pay(
        authorId,
        args.join(' ').toLowerCase()
      )
      channel.send(
        `${purseTransaction(
          purseTotal(paid),
          purseTotal(change),
          username
        )}\n${purseContent(purseTotal(update), username)}`
      )
    } catch (error) {
      channel.send(notEnoughMoney(username))
    }
    return
  } else {
    purse = await set(authorId, args.join(' ').toLowerCase())
  }
  channel.send(purseContent(purseTotal(purse), username))
}
