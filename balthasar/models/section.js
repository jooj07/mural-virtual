const Sequelize = require('sequelize')
const database = require('../db')
// const { stubFalse } = require('lodash')

const Section = database.define('Section', {
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
  },
  phoneAssistance: {
    type: Sequelize.STRING,
    allowNull: true
  },
  emailAssistance: {
    type: Sequelize.STRING,
    allowNull: true
  }
}, {
  paranoid: true,
  timestamps: true
})
Section.associate = (models) => {
  // associations can be defined here
  Section.belongsToMany(models.Post, {
    through: 'PostSection',
    onDelete: 'CASCADE',
    as: 'post'
  })
  Section.belongsToMany(models.User, {
    through: 'UserSection',
    onDelete: 'CASCADE',
    as: 'user'
  })
}
module.exports = Section
