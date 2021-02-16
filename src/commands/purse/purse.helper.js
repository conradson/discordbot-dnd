const { localize } = require('../../helpers/locale.helper')
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

  amountToCopper(amount, locale) {
    let total = 0
    for (const type of amount.split(' ')) {
      const value = parseInt(type.replace(/\D/g, ''))
      if (type.endsWith(localize('pp', locale))) {
        total += value * 1000
      } else if (type.endsWith(localize('gp', locale))) {
        total += value * 100
      } else if (type.endsWith(localize('ep', locale))) {
        total += value * 50
      } else if (type.endsWith(localize('sp', locale))) {
        total += value * 10
      } else if (type.endsWith(localize('cp', locale))) {
        total += value
      }
    }
    return total
  },

  amountToPurse(amount, locale) {
    let purse = {
      pp: 0,
      gp: 0,
      ep: 0,
      sp: 0,
      cp: 0,
    }
    for (const type of amount.split(' ')) {
      const value = parseInt(type.replace(/\D/g, ''))
      if (type.endsWith(localize('pp', locale))) {
        purse.pp = value
      } else if (type.endsWith(localize('gp', locale))) {
        purse.gp = value
      } else if (type.endsWith(localize('ep', locale))) {
        purse.ep = value
      } else if (type.endsWith(localize('sp', locale))) {
        purse.sp = value
      } else if (type.endsWith(localize('cp', locale))) {
        purse.cp = value
      }
    }
    return purse
  },
}
