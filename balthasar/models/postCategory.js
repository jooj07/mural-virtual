const Sequelize = require('sequelize')
const database = require('../db')

const PostCategory = database.define('PostCategory', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  CategoryId: {
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
module.exports = PostCategory
