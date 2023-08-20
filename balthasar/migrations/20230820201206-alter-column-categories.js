'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Category', {
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
    await queryInterface.dropTable('Category')
  }
}
