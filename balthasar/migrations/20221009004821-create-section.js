'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Section', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
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
      },
      deletedAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
      createdAt: {
        type: Sequelize.DATE
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Section')
  }
}
