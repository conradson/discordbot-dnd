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
    paids: '%1$s paids %2$s',
    receives: 'and receives %s',
    not_enough_money: "%s doesn't have enough money.",
    no_character_selected:
      'Please specify your character name, eg: `%1$s%2$s hagark`',
    invalid_command:
      'Invalid command, use one of the following: set, reset, gain, pay',
    help:
      "You need to begin all your commands with your character's name (without spaces), eg: `%1$s%2$s hagark`\n\nCommand list:\n- see the content of your purse, eg: `%1$s%2$s *name*`\n- **s**et: set your purse to a specific amount, eg: `%1$s%2$s *name* s 6gp 13sp 52cp`\n- **r**eset: empty your purse, eg: `%1$s%2$s *name* r`\n- **g**ain: add money to your purse, eg: `%1$s%2$s *name* g 2gp 1sp`\n- **p**ay: pay an amount with your purse, eg: `%1$s%2$s *name* p 23sp 7cp`",
  },
  french: {
    pp: 'pp',
    gp: 'po',
    ep: 'pe',
    sp: 'pa',
    cp: 'pc',
    purse_empty: 'Le porte-monnaie de %s est vide.',
    purse_contains: 'Le porte-monnaie de %1$s contient : %2$s',
    paids: '%1$s a payé %2$s',
    receives: 'et reçoit %s',
    not_enough_money: "%s n'a pas assez d'argent.",
    no_character_selected:
      'Merci de préciser le nom de votre personnage, ex: %1$s%2$s hagark',
    invalid_command:
      'Commande invalide, elle doit figurer parmi: set, reset, gain, pay',
    help:
      'Vous devez précéder chaque commande du prénom de votre personnage (sans espaces), eg: `%1$s%2$s hagark`\n\n**Liste des commandes :**\n- voir le contenu de votre porte-monnaie, eg: `%1$s%2$s *name*`\n- **s**et: défini une valeur précise à votre porte-monnaie, eg: `%1$s%2$s *name* s 6po 13pa 52pc`\n- **r**eset: vide votre porte-monnaie, eg: `%1$s%2$s *name* r`\n- **g**ain: ajoute des pièces à votre porte-monnaie, eg: `%1$s%2$s *name* g 2po 1pa`\n- **p**ay: paye une somme avec votre porte-monnaie, eg: `%1$s%2$s *name* p 23pa 7pc`',
  },
}

const language =
  process.env.LANGUAGE in locales ? process.env.LANGUAGE : 'english'
module.exports = locales[language]
