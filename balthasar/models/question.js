const Sequelize = require('sequelize')
const database = require('../db')

const Question = database.define('Question', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  question: {
    type: Sequelize.STRING,
    allowNull: false
  },
  answer: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  paranoid: true,
  timestamps: true
})
Question.associate = (models) => {
  // associations can be defined here
  Question.belongsToMany(models.User, {
    through: 'UserQuestion',
    onDelete: 'CASCADE',
    as: 'user'
  })
}
module.exports = Question
