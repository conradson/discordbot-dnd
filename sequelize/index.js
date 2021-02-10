const { Sequelize } = require('sequelize')
require('dotenv').config()

const options = {
  host: process.env.DB_HOST || 'localhost',
  dialect: process.env.DB_DIALECT || 'sqlite',
  logging: false,
}
if (!process.env.DB_DIALECT || process.env.DB_DIALECT === 'sqlite') {
  options.storage = 'database.sqlite'
}
module.exports = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.BD_PASSWORD,
  options
)
