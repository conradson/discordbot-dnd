require('dotenv').config()
const locales = require('./purse.locale')

const PP_EMOJI = process.env.PP_EMOJI || locales.pp
const GP_EMOJI = process.env.GP_EMOJI || locales.gp
const EP_EMOJI = process.env.EP_EMOJI || locales.ep
const SP_EMOJI = process.env.SP_EMOJI || locales.sp
const CP_EMOJI = process.env.CP_EMOJI || locales.cp

module.exports = {
  PP_EMOJI,
  GP_EMOJI,
  EP_EMOJI,
  SP_EMOJI,
  CP_EMOJI,
}
