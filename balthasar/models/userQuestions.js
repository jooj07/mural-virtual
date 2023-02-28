const Sequelize = require('sequelize')
const database = require('../db')

const UserQuestion = database.define('UserQuestion', {
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
  QuestionId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  paranoid: true,
  timestamps: true
})
module.exports = UserQuestion
