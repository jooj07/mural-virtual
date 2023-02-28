const Sequelize = require('sequelize')
const database = require('../db')

const UserSection = database.define('UserSection', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  UserId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  SectionId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  paranoid: true,
  timestamps: true
})
module.exports = UserSection
