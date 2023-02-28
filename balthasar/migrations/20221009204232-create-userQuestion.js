'use strict'
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('UserQuestion', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'User',
          key: 'id'
        },
        allowNull: false
      },
      QuestionId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Question',
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
    await queryInterface.dropTable('UserQuestion')
  }
}
