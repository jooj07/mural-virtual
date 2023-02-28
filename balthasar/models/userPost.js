const Sequelize = require('sequelize')
const database = require('../db')

const userPost = database.define('UserPost', {
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
  PostId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  paranoid: true,
  timestamps: true
})
module.exports = userPost
