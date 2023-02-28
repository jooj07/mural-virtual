const Sequelize = require('sequelize')
const database = require('../db')

const PostSection = database.define('PostSection', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  PostId: {
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
module.exports = PostSection
