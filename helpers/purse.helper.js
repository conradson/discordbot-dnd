exports.purseToCopper = (purse) => {
  return (
    purse.pp * 1000 + purse.gp * 100 + purse.ep * 50 + purse.sp * 10 + purse.cp
  )
}

exports.amountToCopper = (amount) => {
  let total = 0
  for (const type of amount.split(' ')) {
    const value = parseInt(type.replace(/\D/g, ''))
    if (type.endsWith('pp')) {
      total += value * 1000
    } else if (type.endsWith('gp') || type.endsWith('po')) {
      total += value * 100
    } else if (type.endsWith('ep') || type.endsWith('pe')) {
      total += value * 50
    } else if (type.endsWith('sp') || type.endsWith('pa')) {
      total += value * 10
    } else if (type.endsWith('cp') || type.endsWith('pc')) {
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
    if (type.endsWith('pp')) {
      purse.pp = value
    } else if (type.endsWith('gp') || type.endsWith('po')) {
      purse.gp = value
    } else if (type.endsWith('ep') || type.endsWith('pe')) {
      purse.ep = value
    } else if (type.endsWith('sp') || type.endsWith('pa')) {
      purse.sp = value
    } else if (type.endsWith('cp') || type.endsWith('pc')) {
      purse.cp = value
    }
  }
  return purse
}

exports.purseTotal = (purse) => {
  let total = []
  if (purse.pp > 0) {
    total.push(`${purse.pp}pp`)
  }
  if (purse.gp > 0) {
    total.push(`${purse.gp}gp`)
  }
  if (purse.ep > 0) {
    total.push(`${purse.ep}ep`)
  }
  if (purse.sp > 0) {
    total.push(`${purse.sp}sp`)
  }
  if (purse.cp > 0) {
    total.push(`${purse.cp}cp`)
  }
  return total
}

exports.purseContent = (currency, username) => {
  let result = `${username}'s purse is empty.`
  if (currency.length > 0) {
    result = `${username}'s purse contains : ${currency.join(', ')}`
  }
  return result
}

exports.purseTransaction = (paid, change, username) => {
  let result = `${username} pays : ${paid.join(', ')}`
  if (change.length) {
    result += ` and receives : ${change.join(', ')}`
  }
  return result
}
