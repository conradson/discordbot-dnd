const { DataTypes } = require('sequelize')
const sequelize = require('../../sequelize/config')

module.exports = sequelize.define('roll', {
  user: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  macro: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
})
