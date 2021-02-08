const { models } = require('../sequelize')
const {
  purseToCopper,
  amountToCopper,
  amountToPurse,
} = require('../helpers/purse.helper')

class PurseController {
  constructor() {
    this.load = this.load.bind(this)
    this.reset = this.reset.bind(this)
    this.set = this.set.bind(this)
    this.gain = this.gain.bind(this)
    this.pay = this.pay.bind(this)
  }

  async load(authorId) {
    let purse = await models.purse.findOne({
      where: { authorId: authorId },
    })
    if (!purse) {
      purse = await models.purse.create({
        authorId: authorId,
        cp: 0,
        sp: 0,
        ep: 0,
        gp: 0,
        pp: 0,
      })
    }
    return purse
  }

  async reset(authorId) {
    const purse = await this.load(authorId)
    purse.pp = 0
    purse.gp = 0
    purse.ep = 0
    purse.sp = 0
    purse.cp = 0
    await purse.save()
    return purse
  }

  async set(authorId, amount) {
    const purse = await this.load(authorId)
    for (const type of amount.split(' ')) {
      const value = parseInt(type.replace(/\D/g, ''))
      if (type.endsWith('pp')) {
        purse.pp = value
      } else if (type.endsWith('gp')) {
        purse.gp = value
      } else if (type.endsWith('ep')) {
        purse.ep = value
      } else if (type.endsWith('sp')) {
        purse.sp = value
      } else if (type.endsWith('cp')) {
        purse.cp = value
      }
    }
    await purse.save()
    return purse
  }

  async gain(authorId, amount) {
    const purse = await this.load(authorId)
    const gain = amountToPurse(amount)
    purse.pp += gain.pp
    purse.gp += gain.gp
    purse.ep += gain.ep
    purse.sp += gain.sp
    purse.cp += gain.cp
    await purse.save()
    return purse
  }

  async pay(authorId, amount) {
    const purse = await this.load(authorId)
    const stash = {
      pp: purse.pp,
      gp: purse.gp,
      ep: purse.ep,
      sp: purse.sp,
      cp: purse.cp,
    }
    const money = purseToCopper(stash)
    const total = amountToCopper(amount)

    if (total > money) {
      throw new Error('Not enough money')
    }
    const bill = amountToPurse(amount)
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

    while (purseToCopper(bill) > purseToCopper(paid)) {
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
    let diff = purseToCopper(paid) - purseToCopper(bill)
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
