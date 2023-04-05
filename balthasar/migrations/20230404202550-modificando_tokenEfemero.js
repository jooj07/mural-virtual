'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tokenEfemero', {
      token: {
        type: Sequelize.STRING
      },
      validade: {
        type: Sequelize.DATE
      },
      userId: {
        type: Sequelize.INTEGER
      }
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('tokenEfemero')
  }
}
