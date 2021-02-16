const Discord = require('discord.js')
const { capitalize } = require('../../helpers/string.helper')
const { getLocale, localize } = require('../../helpers/locale.helper')
const purseConstants = require('./purse.constant')
const purseRepository = require('./purse.repository')

module.exports = async (message, args) => {
  const {
    channel,
    author: { id: authorId },
  } = message
  const locale = await getLocale(message)

  if (args.length < 1 || args[0] === 'help' || args[0] === 'h') {
    const help = new Discord.MessageEmbed().addFields({
      name: localize('Help: DnD purse', locale),
      value: localize(
        "You need to begin all your commands with your character's name (without spaces), eg: `!purse hagark`\n\nCommand list:\n- see the content of your purse, eg: `!purse *name*`\n- **s**et: set your purse to a specific amount, eg: `!purse *name* s 6gp 13sp 52cp`\n- **r**eset: empty your purse, eg: `!purse *name* r`\n- **g**ain: add money to your purse, eg: `!purse *name* g 2gp 1sp`\n- **p**ay: pay an amount with your purse, eg: `!purse *name* p 23sp 7cp`",
        locale
      ),
    })
    message.author.send(help)
    return
  }
  const character = capitalize(args.shift().toLowerCase())
  const reserved = ['set', 's', 'reset', 'r', 'pay', 'p', 'gain', 'g']
  if (reserved.includes(character.toLowerCase())) {
    channel.send(
      localize(
        'Please specify your character name, eg: `!purse hagark`',
        locale
      )
    )
    return
  }
  await purseRepository.init(authorId, character, locale)

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
        `${purseTransaction(
          purseTotal(paid),
          purseTotal(change),
          character,
          locale
        )}\n${purseContent(purseTotal(update), character, locale)}`
      )
    } catch (error) {
      channel.send(localize("%s doesn't have enough money.", locale, character))
    }
    return
  } else if (args.length > 0) {
    channel.send(
      localize(
        'Invalid command, use one of the following: set, reset, gain, pay',
        locale
      )
    )
    return
  }
  channel.send(purseContent(purseTotal(purse), character, locale))
}

function purseTotal(purse) {
  let total = []
  if (purse.pp > 0) {
    total.push(`${purse.pp}${purseConstants.PP_EMOJI}`)
  }
  if (purse.gp > 0) {
    total.push(`${purse.gp}${purseConstants.GP_EMOJI}`)
  }
  if (purse.ep > 0) {
    total.push(`${purse.ep}${purseConstants.EP_EMOJI}`)
  }
  if (purse.sp > 0) {
    total.push(`${purse.sp}${purseConstants.SP_EMOJI}`)
  }
  if (purse.cp > 0) {
    total.push(`${purse.cp}${purseConstants.CP_EMOJI}`)
  }
  return total
}

function purseContent(currency, character, locale) {
  let result = localize("%s's purse is empty.", locale, character)
  if (currency.length > 0) {
    result = localize(
      "%1$s's purse contains: %2$s",
      locale,
      character,
      currency.join(', ')
    )
  }
  return result
}

function purseTransaction(paid, change, character, locale) {
  let result = localize('%1$s paids %2$s', locale, character, paid.join(', '))
  if (change.length) {
    result += localize('and receives %s', locale, change.join(', '))
  }
  return result
}
