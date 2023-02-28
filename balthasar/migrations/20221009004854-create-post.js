'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Post', {
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
    await queryInterface.dropTable('Post')
  }
}
