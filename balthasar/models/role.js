const Sequelize = require('sequelize')
const database = require('../db')

const Role = database.define('Role', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING
  }
}, {
  paranoid: true,
  timestamps: true
})
Role.associate = (models) => {
  // associations can be defined here
  Role.belongsToMany(models.User, {
    through: 'UserRole',
    onDelete: 'CASCADE',
    as: 'user'
  })
}
module.exports = Role
