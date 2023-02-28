'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Question', {
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
    await queryInterface.dropTable('Question')
  }
}
