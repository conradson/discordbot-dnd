const purseModel = require('./purse.model')
const helper = require('./purse.helper')
const locales = require('./purse.locale')

class PurseController {
  async load(authorId, character) {
    let purse = await purseModel.findOne({
      where: { authorId: authorId, character: character },
    })
    if (!purse) {
      purse = await purseModel.create({
        authorId: authorId,
        character: character,
        cp: 0,
        sp: 0,
        ep: 0,
        gp: 0,
        pp: 0,
      })
    }
    return purse
  }

  async reset(authorId, character) {
    const purse = await this.load(authorId, character)
    purse.pp = 0
    purse.gp = 0
    purse.ep = 0
    purse.sp = 0
    purse.cp = 0
    await purse.save()
    return purse
  }

  async set(authorId, character, amount) {
    const purse = await this.load(authorId, character)
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
    await purse.save()
    return purse
  }

  async gain(authorId, character, amount) {
    const purse = await this.load(authorId, character)
    const gain = helper.amountToPurse(amount)
    purse.pp += gain.pp
    purse.gp += gain.gp
    purse.ep += gain.ep
    purse.sp += gain.sp
    purse.cp += gain.cp
    await purse.save()
    return purse
  }

  async pay(authorId, character, amount) {
    const purse = await this.load(authorId, character)
    const stash = {
      pp: purse.pp,
      gp: purse.gp,
      ep: purse.ep,
      sp: purse.sp,
      cp: purse.cp,
    }
    const money = helper.purseToCopper(stash)
    const total = helper.amountToCopper(amount)

    if (total > money) {
      throw new Error('Not enough money')
    }
    const bill = helper.amountToPurse(amount)
    const paid = {
      pp: 0,
      gp: 0,
      ep: 0,
      sp: 0,
      cp: 0,
    }
    // pay what you can
    paid.pp += Math.min(bill.pp, stash.pp)
    stash.pp -= paid.pp
    paid.gp += Math.min(bill.gp, stash.gp)
    stash.gp -= paid.gp
    paid.ep += Math.min(bill.ep, stash.ep)
    stash.ep -= paid.ep
    paid.sp += Math.min(bill.sp, stash.sp)
    stash.sp -= paid.sp
    paid.cp += Math.min(bill.cp, stash.cp)
    stash.cp -= paid.cp

    while (helper.purseToCopper(bill) > helper.purseToCopper(paid)) {
      if (stash.cp > 0) {
        paid.cp += stash.cp
        stash.cp = 0
      } else if (stash.sp > 0) {
        paid.sp += stash.sp
        stash.sp = 0
      } else if (stash.ep > 0) {
        paid.ep += stash.ep
        stash.ep = 0
      } else if (stash.gp > 0) {
        paid.gp += stash.gp
        stash.gp = 0
      } else if (stash.pp > 0) {
        paid.pp += stash.pp
        stash.pp = 0
      }
    }
    let diff = helper.purseToCopper(paid) - helper.purseToCopper(bill)
    const change = {
      pp: 0,
      gp: 0,
      ep: 0,
      sp: 0,
      cp: 0,
    }
    change.gp = Math.floor(diff / 100)
    diff -= change.gp * 100
    change.sp = Math.floor(diff / 10)
    diff -= change.sp * 10
    change.cp = diff

    // remove change overflow
    if (paid.cp > 0 && change.cp > 0) {
      if (paid.cp > change.cp) {
        paid.cp = paid.cp - change.cp
        change.cp = 0
      } else {
        change.cp = change.cp - paid.cp
        paid.cp = 0
      }
    }
    if (paid.sp > 0 && change.sp > 0) {
      if (paid.sp > change.sp) {
        paid.sp = paid.sp - change.sp
        change.sp = 0
      } else {
        change.sp = change.sp - paid.sp
        paid.sp = 0
      }
    }
    if (paid.gp > 0 && change.gp > 0) {
      if (paid.gp > change.gp) {
        paid.gp = paid.gp - change.gp
        change.gp = 0
      } else {
        change.gp = change.gp - paid.gp
        paid.gp = 0
      }
    }

    purse.pp = purse.pp - paid.pp + change.pp
    purse.gp = purse.gp - paid.gp + change.gp
    purse.ep = purse.ep - paid.ep + change.ep
    purse.sp = purse.sp - paid.sp + change.sp
    purse.cp = purse.cp - paid.cp + change.cp

    await purse.save()
    return { paid: paid, change: change, update: purse }
  }
}

module.exports = new PurseController()
