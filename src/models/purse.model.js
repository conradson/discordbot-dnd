const { DataTypes } = require('sequelize')
const sequelize = require('../sequelize')

module.exports = sequelize.define('purse', {
  authorId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  character: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cp: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sp: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ep: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  gp: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  pp: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
})
