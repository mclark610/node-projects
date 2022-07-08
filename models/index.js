'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const Sequelize = require('sequelize');

const Config = require('config');

const config  = Config.get('database');
const options = Config.get('sequelize.options');
const db = {};
const models = [];

let sequelize = new Sequelize(config.database, config.username, config.password, options);
/*
//Webpack require.context : read in a directory - use regex for searches!
const context = require.context('.', true, /^\.\/(?!index\.js).*\.js$/, 'sync')
context.keys().map(context).forEach(module => {
  const sequelizeModel = module(sequelize, Sequelize);
  db[sequelizeModel.name] = sequelizeModel;
})
*/

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//grab all model files and plop into an array
fs.readdirSync("./models/")
    .filter( file => file !== "index.js")
    .forEach( file => {
//        console.log("dirname: " + __dirname);
//        console.log("filefound: " + file);
        models.push(require(path.join(__dirname,file)));
    });

// load each model passing in sequelize and where to find datatypes
_.each(models, (modelName) => {
    const model = modelName(sequelize,Sequelize);
    db[model.name] = model;
});

// run each
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

module.exports = db;
