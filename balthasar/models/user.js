const Sequelize = require('sequelize')
const database = require('../db')

const User = database.define('User', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  login: {
    // matricula
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Deve ser um endereço de e-mail válido'
      }
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  active: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  status: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1 // em aprovação
  },
  expires: {
    type: Sequelize.DATE,
    allowNull: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: true
  }
}, {
  paranoid: true,
  timestamps: true
})
User.associate = (models) => {
  // associations can be defined here
  User.belongsToMany(models.Post, {
    through: 'UserPost',
    onDelete: 'CASCADE',
    as: 'post'
  })
  User.belongsToMany(models.Role, {
    through: 'UserRole',
    onDelete: 'CASCADE',
    as: 'role'
  })
  User.belongsToMany(models.Question, {
    through: 'UserQuestion',
    onDelete: 'CASCADE',
    as: 'question'
  })
  User.belongsToMany(models.Section, {
    through: 'UserSection',
    onDelete: 'CASCADE',
    as: 'section'
  })
}
module.exports = User
