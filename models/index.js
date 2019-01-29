'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const Config = require('config');

const config  = Config.get('database');
const options = Config.get('sequelize.options');
const db = {};

console.log("options: " + JSON.stringify(options));
console.log("sqlconfig" + JSON.stringify(config));

let sequelize = new Sequelize(config.database, config.username, config.password, options);
/*
let sequelize = new Sequelize("maintain", "maintain", "maintain",
{
  dialect: 'mysql',
  host: "localhost",
  port: 3306,
  operatorsAliases: false,
  pool: {
    max: 3,
    min: 0,
    acquire: 30*1000,
    idle: 1000
  }
});
*/
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
