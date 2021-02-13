const { Sequelize } = require('sequelize')
require('dotenv').config()

module.exports = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.BD_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB_DIALECT || 'sqlite',
    logging: false,
    storage: 'database.sqlite',
  }
)
