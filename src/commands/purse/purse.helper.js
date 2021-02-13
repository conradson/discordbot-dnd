const i18n = require('i18n')
const constants = require('./purse.constant')

module.exports = {
  purseToCopper(purse) {
    return (
      purse.pp * 1000 +
      purse.gp * 100 +
      purse.ep * 50 +
      purse.sp * 10 +
      purse.cp
    )
  },

  amountToCopper(amount) {
    let total = 0
    for (const type of amount.split(' ')) {
      const value = parseInt(type.replace(/\D/g, ''))
      if (type.endsWith(i18n.__('pp'))) {
        total += value * 1000
      } else if (type.endsWith(i18n.__('gp'))) {
        total += value * 100
      } else if (type.endsWith(i18n.__('ep'))) {
        total += value * 50
      } else if (type.endsWith(i18n.__('sp'))) {
        total += value * 10
      } else if (type.endsWith(i18n.__('cp'))) {
        total += value
      }
    }
    return total
  },

  amountToPurse(amount) {
    let purse = {
      pp: 0,
      gp: 0,
      ep: 0,
      sp: 0,
      cp: 0,
    }
    for (const type of amount.split(' ')) {
      const value = parseInt(type.replace(/\D/g, ''))
      if (type.endsWith(i18n.__('pp'))) {
        purse.pp = value
      } else if (type.endsWith(i18n.__('gp'))) {
        purse.gp = value
      } else if (type.endsWith(i18n.__('ep'))) {
        purse.ep = value
      } else if (type.endsWith(i18n.__('sp'))) {
        purse.sp = value
      } else if (type.endsWith(i18n.__('cp'))) {
        purse.cp = value
      }
    }
    return purse
  },

  purseTotal(purse) {
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
  },

  purseContent(currency, character) {
    let result = i18n.__("%s's purse is empty.", character)
    if (currency.length > 0) {
      result = i18n.__(
        "%1$s's purse contains: %2$s",
        character,
        currency.join(', ')
      )
    }
    return result
  },

  purseTransaction(paid, change, character) {
    let result = i18n.__('%1$s paids %2$s', character, paid.join(', '))
    if (change.length) {
      result += i18n.__('and receives %s', change.join(', '))
    }
    return result
  },
}
