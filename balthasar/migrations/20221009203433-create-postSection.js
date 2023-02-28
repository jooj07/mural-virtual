'use strict'
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('PostSection', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      PostId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Post',
          key: 'id'
        },
        allowNull: false
      },
      SectionId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Section',
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
    await queryInterface.dropTable('PostSection')
  }
}
