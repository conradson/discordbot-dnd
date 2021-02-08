const { Sequelize } = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.BD_PASSWORD,
  {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
  }
)

require('./models/purse.model')(sequelize)
sequelize.sync()

module.exports = sequelize
