const Sequelize = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PWD.toString(),
  {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    logging: true
  })

module.exports = sequelize
