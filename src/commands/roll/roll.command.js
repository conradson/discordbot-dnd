const Discord = require('discord.js')
const rollRepository = require('./roll.repository')
const { getLocale, localize } = require('../../helpers/locale.helper')

module.exports = async (message, args) => {
  const {
    channel,
    author: { id: authorId, username },
  } = message
  const locale = await getLocale(message)

  if (args.length < 1 || args[0] === 'h' || args[0] === 'help') {
    const help = new Discord.MessageEmbed().addFields({
      name: localize('Help: DnD dice roll', locale),
      value: localize(
        'To roll a die, use the command `!roll`.\n To roll several dice, add the parameter `xdy`, where x and y are numbers. Example: `!roll 2d20` to roll 2 D20. Parameter `xdy` can be repeated several times in order to roll dice of different values. \n\n To add a **modifier**, enter `$x` after the roll, where $ is `+`, `-` or `*` and x is a number. Example: `!roll 2d8+2` to roll 2 D8 and add 2. \n\n To **repeat** a dice roll, add `rx` after the roll, where x is a number. Example: `!roll 3d6r4` to roll 3 D6 4 times.\n\n To make **independent** dice rolls, use the `i` command.  Example: `!roll i 2d6 1d8` for scores of 2 D6 and 1 D8 independently. \n\n To record or modify a **macro**, add the macro name before the dice roll. Example: `!roll bsword 2d12+4`. \n To execute a macro, just name it. Example: `!roll bsword` \n To delete a macro, you must prefix its name with a `!`. Example: `!roll !bsword`.',
        locale
      ),
    })
    message.author.send(help)
    return
  }

  await rollRepository.init(authorId)

  const reserved = ['i', 'indiv', 'l', 'list']
  let macro = args.length > 0 ? args[0] : null
  if (
    macro &&
    !reserved.includes(macro) &&
    isNaN(macro[0]) &&
    (macro[0] !== 'd' || (macro.length > 1 && isNaN(macro[1])))
  ) {
    if (macro[0] === '!') {
      macro = macro.substring(1)
      const removed = await rollRepository.remove(macro)
      if (!removed) {
        channel.send(
          localize('No macro `%1$s` found for %2$s', locale, macro, username)
        )
      } else {
        channel.send(
          localize('%1$s removes macro `%2$s`', locale, username, macro)
        )
      }
      return
    }
    args.shift()
    if (args.length) {
      const id = await rollRepository.save(macro, args.join(' '))
      if (id !== -1) {
        channel.send(
          localize('%1$s adds macro `%2$s`', locale, username, macro)
        )
      }
      return
    } else {
      const values = await rollRepository.load(macro)
      if (!values) {
        channel.send(
          localize('No macro `%1$s` found for %2$s', locale, macro, username)
        )
        return
      } else {
        args = values.split(' ')
      }
    }
  }
  let indiv = false
  if (args[0] === 'i' || args[0] === 'indiv') {
    args.shift()
    indiv = true
  } else if (args[0] === 'l' || args[0] === 'list') {
    const macros = await rollRepository.findAll()
    if (macros && macros.length > 0) {
      channel.send(
        localize(
          '%1$s macros:\n%2$s',
          locale,
          username,
          macros
            .map((macro) => {
              return localize('• `%1$s` %2$s', locale, macro.macro, macro.value)
            })
            .join('\n')
        )
      )
    } else {
      channel.send(localize('%s has no macro', locale, username))
    }
    return
  }
  let total = 0
  let rolls = args.map((arg) => {
    let prefix = 1
    if (arg.includes('d')) {
      if (arg[0] === 'd') {
        arg = arg.substring(1)
      } else {
        prefix = !isNaN(arg.split('d')[0]) ? arg.split('d')[0] : 1
        arg = arg.split('d')[1]
      }
    }
    let value = ''
    while (arg.length > 0 && !isNaN(arg[0])) {
      value = `${value}${arg[0]}`
      arg = arg.substring(1)
    }
    value = parseInt(value)
    let suffix = arg
    let repeat = 1
    let modType = null
    let modValue = null
    if (
      suffix[0] === '+' ||
      suffix[0] === '-' ||
      suffix[0] === '*' ||
      suffix[0] === 'x'
    ) {
      modType = suffix[0]
      if (modType === '*') {
        modType = 'x'
      }
      suffix = suffix.substring(1)
      let mod = ''
      while (suffix.length && !isNaN(suffix[0])) {
        mod = `${mod}${suffix[0]}`
        suffix = suffix.substring(1)
      }
      modValue = isNaN(mod) ? 0 : parseInt(mod)
    }
    if (suffix[0] === 'r') {
      suffix = suffix.substring(1)
      repeat = isNaN(suffix) ? 1 : parseInt(suffix)
    }
    let result = []
    for (let r = 0; r < repeat; r++) {
      const dices = []
      for (let i = 0; i < prefix; i++) {
        if (isNaN(value)) {
          return localize('[value unknown]', locale)
        }
        const roll = Math.floor(1 + Math.random() * value)
        total += roll
        dices.push(roll)
      }

      if (indiv) {
        let sum = dices.reduce((acc, v) => (acc += v))
        let modifier = ''
        if (modType === '+' || modType === '-' || modType === 'x') {
          if (modType === '+') {
            sum += modValue
          } else if (modType === '-') {
            sum = Math.max(0, sum - modValue)
          } else {
            sum *= modValue
          }
          modifier = `${modType}${modValue}`
        }
        if (dices.length > 1) {
          result.push(`(${dices.join(', ')})${modifier} = ${sum}`)
        } else {
          result.push(`${dices[0]}${modifier} = ${sum}`)
        }
      } else {
        let modifier = ''
        if (modType === '+' || modType === '-' || modType === 'x') {
          if (modType === '+') {
            total += modValue
          } else if (modType === '-') {
            total = Math.max(0, total - modValue)
          } else {
            total *= modValue
          }
          modifier = `${modType}${modValue}`
        }
        if (dices.length > 1) {
          result.push(`(${dices.join(', ')})${modifier}`)
        } else {
          result.push(`${dices[0]}${modifier}`)
        }
      }
    }
    return indiv ? result.join('\n') : result.join(', ')
  })

  let result = ''
  if (indiv) {
    result += localize('%1$s rolls:\n%2$s', locale, username, rolls.join('\n'))
  } else {
    rolls = rolls.join(' + ')
    result +=
      localize(`%1$s rolls %2$s`, locale, username, rolls) +
      (rolls.includes(',') || rolls.includes('+')
        ? localize(`\nTotal %s`, locale, total)
        : '')
  }

  channel.send(result)
}
