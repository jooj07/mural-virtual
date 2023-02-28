const Sequelize = require('sequelize')
const database = require('../db')

const UserRole = database.define('UserRole', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  RoleId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  UserId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  paranoid: true,
  timestamps: true
})
module.exports = UserRole
