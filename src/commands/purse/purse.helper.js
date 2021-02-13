var { sprintf } = require('sprintf-js')
const constants = require('./purse.constant')
const { capitalize } = require('../../helpers/string.helpers')

module.exports = class PurseHelper {
  constructor(locales) {
    this.locales = locales
  }

  purseToCopper(purse) {
    return (
      purse.pp * 1000 +
      purse.gp * 100 +
      purse.ep * 50 +
      purse.sp * 10 +
      purse.cp
    )
  }

  amountToCopper(amount) {
    let total = 0
    for (const type of amount.split(' ')) {
      const value = parseInt(type.replace(/\D/g, ''))
      if (type.endsWith(this.locales.pp)) {
        total += value * 1000
      } else if (type.endsWith(this.locales.gp)) {
        total += value * 100
      } else if (type.endsWith(this.locales.ep)) {
        total += value * 50
      } else if (type.endsWith(this.locales.sp)) {
        total += value * 10
      } else if (type.endsWith(this.locales.cp)) {
        total += value
      }
    }
    return total
  }

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
      if (type.endsWith(this.locales.pp)) {
        purse.pp = value
      } else if (type.endsWith(this.locales.gp)) {
        purse.gp = value
      } else if (type.endsWith(this.locales.ep)) {
        purse.ep = value
      } else if (type.endsWith(this.locales.sp)) {
        purse.sp = value
      } else if (type.endsWith(this.locales.cp)) {
        purse.cp = value
      }
    }
    return purse
  }

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
  }

  purseContent(currency, character) {
    let result = sprintf(this.locales.purse_empty, capitalize(character))
    if (currency.length > 0) {
      result = sprintf(
        this.locales.purse_contains,
        capitalize(character),
        currency.join(', ')
      )
    }
    return result
  }

  purseTransaction(paid, change, character) {
    let result = sprintf(
      this.locales.paids,
      capitalize(character),
      paid.join(', ')
    )
    if (change.length) {
      result += sprintf(this.locales.receives, change.join(', '))
    }
    return result
  }

  notEnoughMoney(character) {
    return sprintf(this.locales.not_enough_money, capitalize(character))
  }

  help() {
    return sprintf(
      this.locales.help,
      process.env.PREFIX || '/',
      process.env.PURSE_SHORT_COMMAND || process.env.PURSE_COMMAND || 'purse'
    )
  }

  noCharacterSelected() {
    return sprintf(
      this.locales.no_character_selected,
      process.env.PREFIX || '/',
      process.env.PURSE_SHORT_COMMAND || process.env.PURSE_COMMAND || 'purse'
    )
  }

  invalidCommand() {
    return this.locales.invalid_command
  }
}
