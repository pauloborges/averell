"use strict"

var Sequelize = require('sequelize')

var pgpass = process.env.POSTGRES_PASSWORD

let database
module.exports = function() {
  if (!database) {
    database = new Sequelize('postgres', 'postgres', pgpass, {
      dialect: 'postgres',
      host: 'db'
    })
  }
  return database
}