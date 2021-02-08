var { sprintf } = require('sprintf-js')
const constants = require('./purse.constant')
const locales = require('./purse.locale')

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

exports.purseContent = (currency, username) => {
  let result = sprintf(locales.purse_empty, username)
  if (currency.length > 0) {
    result = sprintf(locales.purse_contains, username, currency.join(', '))
  }
  return result
}

exports.purseTransaction = (paid, change, username) => {
  let result = sprintf(locales.paids, username, paid.join(', '))
  if (change.length) {
    result += sprintf(locales.receives, change.join(', '))
  }
  return result
}

exports.notEnoughMoney = (username) => {
  return sprintf(locales.not_enough_money, username)
}
