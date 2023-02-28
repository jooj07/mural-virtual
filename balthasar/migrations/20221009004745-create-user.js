'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('User', {
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
    await queryInterface.dropTable('User')
  }
}
