const { DataTypes } = require('sequelize')
const sequelize = require('../../sequelize/config')

module.exports = sequelize.define('config', {
  channelId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  locale: {
    type: DataTypes.STRING,
    defaultValue: 'en',
  },
})
