require('dotenv').config()

const locales = {
  english: {
    pp: 'pp',
    gp: 'gp',
    ep: 'ep',
    sp: 'sp',
    cp: 'cp',
    purse_empty: "%s's purse is empty.",
    purse_contains: "%1$s's purse contains: %2$s",
    paids: "%1$s's paids %2$s",
    receives: 'and receives %s',
    not_enough_money: "%s doesn't have enough money.",
  },
  french: {
    pp: 'pp',
    gp: 'po',
    ep: 'pe',
    sp: 'pa',
    cp: 'pc',
    purse_empty: 'Le porte-monnaie de %s est vide.',
    purse_contains: 'Le porte-monnaie de %1$s contient : %2$s',
    paids: "%1$s's a payé %2$s",
    receives: 'et reçoit %s',
    not_enough_money: "%s n'a pas assez d'argent.",
  },
}

const language =
  process.env.LANGUAGE in locales ? process.env.LANGUAGE : 'english'
module.exports = locales[language]
