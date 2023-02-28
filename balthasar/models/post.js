const Sequelize = require('sequelize')
const database = require('../db')

const Post = database.define('Post', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true
  },
  content: {
    type: Sequelize.BLOB,
    allowNull: true
  },
  expiresAt: {
    type: Sequelize.DATE,
    allowNull: true
  },
  active: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  moreInfo: {
    type: Sequelize.BLOB,
    allowNull: true
  },
  priority: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  status: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1 // em aprovação
  }
}, {
  paranoid: true,
  timestamps: true
})

Post.associate = (models) => {
  // associations can be defined here
  Post.belongsToMany(models.Category, {
    through: 'PostCategory',
    onDelete: 'CASCADE',
    as: 'category'
  })
  Post.belongsToMany(models.Section, {
    through: 'PostSection',
    onDelete: 'CASCADE',
    as: 'section'
  })
  Post.belongsToMany(models.User, {
    through: 'UserPost',
    onDelete: 'CASCADE',
    as: 'user'
  })
}
module.exports = Post
