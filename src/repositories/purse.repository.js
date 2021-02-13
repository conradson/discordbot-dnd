const i18n = require('i18n')
const purseModel = require('../models/purse.model')
const purseHelper = require('../helpers/purse.helper')

class PurseRepository {
  async init(authorId, character) {

    purseModel.sync()
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
    this.purse = purse
  }

  async reset() {
    this.purse.pp = 0
    this.purse.gp = 0
    this.purse.ep = 0
    this.purse.sp = 0
    this.purse.cp = 0
    await this.purse.save()
    return this.purse
  }

  async set(amount) {
    for (const type of amount.split(' ')) {
      const value = parseInt(type.replace(/\D/g, ''))
      if (type.endsWith(i18n.__('pp'))) {
        this.purse.pp = value
      } else if (type.endsWith(i18n.__('gp'))) {
        this.purse.gp = value
      } else if (type.endsWith(i18n.__('ep'))) {
        this.purse.ep = value
      } else if (type.endsWith(i18n.__('sp'))) {
        this.purse.sp = value
      } else if (type.endsWith(i18n.__('cp'))) {
        this.purse.cp = value
      }
    }
    await this.purse.save()
    return this.purse
  }

  async gain(amount) {
    const gain = purseHelper.amountToPurse(amount)
    this.purse.pp += gain.pp
    this.purse.gp += gain.gp
    this.purse.ep += gain.ep
    this.purse.sp += gain.sp
    this.purse.cp += gain.cp
    await this.purse.save()
    return this.purse
  }

  async pay(amount) {
    const stash = {
      pp: this.purse.pp,
      gp: this.purse.gp,
      ep: this.purse.ep,
      sp: this.purse.sp,
      cp: this.purse.cp,
    }
    const money = purseHelper.purseToCopper(stash)
    const total = purseHelper.amountToCopper(amount)

    if (total > money) {
      throw new Error('Not enough money')
    }
    const bill = purseHelper.amountToPurse(amount)
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

    while (purseHelper.purseToCopper(bill) > purseHelper.purseToCopper(paid)) {
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
    let diff = purseHelper.purseToCopper(paid) - purseHelper.purseToCopper(bill)
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

    this.purse.pp = this.purse.pp - paid.pp + change.pp
    this.purse.gp = this.purse.gp - paid.gp + change.gp
    this.purse.ep = this.purse.ep - paid.ep + change.ep
    this.purse.sp = this.purse.sp - paid.sp + change.sp
    this.purse.cp = this.purse.cp - paid.cp + change.cp

    await this.purse.save()
    return { paid: paid, change: change, update: this.purse }
  }
}

module.exports = new PurseRepository()
