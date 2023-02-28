'use strict'
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('UserRole', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      RoleId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Role',
          key: 'id'
        },
        allowNull: false
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'User',
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
    await queryInterface.dropTable('UserRole')
  }
}
