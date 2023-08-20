const Sequelize = require('sequelize')
const database = require('../db')

const Category = database.define('Category', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    unique: false,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING
  }
}, {
  paranoid: true,
  timestamps: true
})
Category.associate = (models) => {
  // associations can be defined here
  Category.belongsToMany(models.Post, {
    through: 'PostCategory',
    onDelete: 'CASCADE',
    as: 'post'
  })
}
module.exports = Category
