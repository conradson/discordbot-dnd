const { DataTypes } = require('sequelize')
const sequelize = require('../../sequelize/config')
require('dotenv').config()

module.exports = sequelize.define('config', {
  guildId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  locale: {
    type: DataTypes.STRING,
    defaultValue: process.env.LOCALE_DEFAULT || 'en',
  },
})
