const { DataTypes } = require('sequelize')
const sequelize = require('../../sequelize/config')

module.exports = sequelize.define('poll', {
  messageId: {
    type: DataTypes.INTEGER,
    unique: true,
  },
  user: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  question: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  answers: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  votes: {
    type: DataTypes.STRING,
    allowNull: false,
  },
})
