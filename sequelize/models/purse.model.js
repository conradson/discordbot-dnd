const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('purse', {
    authorId: {
      type: DataTypes.INTEGER,
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
}
