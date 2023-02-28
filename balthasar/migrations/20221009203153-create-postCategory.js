'use strict'
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('PostCategory', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      CategoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Category',
          key: 'id'
        },
        allowNull: false
      },
      PostId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Post',
          key: 'id'
        },
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('PostCategory')
  }
}
