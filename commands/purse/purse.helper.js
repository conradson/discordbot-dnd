var { sprintf } = require('sprintf-js')
const constants = require('./purse.constant')
const locales = require('./purse.locale')
const { capitalize } = require('../../helpers/string.helpers')

exports.purseToCopper = (purse) => {
  return (
    purse.pp * 1000 + purse.gp * 100 + purse.ep * 50 + purse.sp * 10 + purse.cp
  )
}

exports.amountToCopper = (amount) => {
  let total = 0
  for (const type of amount.split(' ')) {
    const value = parseInt(type.replace(/\D/g, ''))
    if (type.endsWith(locales.pp)) {
      total += value * 1000
    } else if (type.endsWith(locales.gp)) {
      total += value * 100
    } else if (type.endsWith(locales.ep)) {
      total += value * 50
    } else if (type.endsWith(locales.sp)) {
      total += value * 10
    } else if (type.endsWith(locales.cp)) {
      total += value
    }
  }
  return total
}

exports.amountToPurse = (amount) => {
  let purse = {
    pp: 0,
    gp: 0,
    ep: 0,
    sp: 0,
    cp: 0,
  }
  for (const type of amount.split(' ')) {
    const value = parseInt(type.replace(/\D/g, ''))
    if (type.endsWith(locales.pp)) {
      purse.pp = value
    } else if (type.endsWith(locales.gp)) {
      purse.gp = value
    } else if (type.endsWith(locales.ep)) {
      purse.ep = value
    } else if (type.endsWith(locales.sp)) {
      purse.sp = value
    } else if (type.endsWith(locales.cp)) {
      purse.cp = value
    }
  }
  return purse
}

exports.purseTotal = (purse) => {
  let total = []
  if (purse.pp > 0) {
    total.push(`${purse.pp}${constants.PP_EMOJI}`)
  }
  if (purse.gp > 0) {
    total.push(`${purse.gp}${constants.GP_EMOJI}`)
  }
  if (purse.ep > 0) {
    total.push(`${purse.ep}${constants.EP_EMOJI}`)
  }
  if (purse.sp > 0) {
    total.push(`${purse.sp}${constants.SP_EMOJI}`)
  }
  if (purse.cp > 0) {
    total.push(`${purse.cp}${constants.CP_EMOJI}`)
  }
  return total
}

exports.purseContent = (currency, character) => {
  let result = sprintf(locales.purse_empty, capitalize(character))
  if (currency.length > 0) {
    result = sprintf(
      locales.purse_contains,
      capitalize(character),
      currency.join(', ')
    )
  }
  return result
}

exports.purseTransaction = (paid, change, character) => {
  let result = sprintf(locales.paids, capitalize(character), paid.join(', '))
  if (change.length) {
    result += sprintf(locales.receives, change.join(', '))
  }
  return result
}

exports.notEnoughMoney = (character) => {
  return sprintf(locales.not_enough_money, capitalize(character))
}

exports.help = () => {
  return sprintf(
    locales.help,
    process.env.PREFIX || '!',
    process.env.PURSE_SHORT_COMMAND || process.env.PURSE_COMMAND || 'purse'
  )
}

exports.noCharacterSelected = () => {
  return sprintf(
    locales.no_character_selected,
    process.env.PREFIX || '!',
    process.env.PURSE_SHORT_COMMAND || process.env.PURSE_COMMAND || 'purse'
  )
}

exports.invalidCommand = () => {
  return locales.invalid_command
}
