'use strict';

const express = require('express');
const path    = require('path');

const logging = require('./modules/logger');
const config  = require('config');

const models = require( './models');
const db = require('./models/index.js');

const app = express();

db.sequelize
    .authenticate()
    .then(function() {
        console.log("sequelize: logged in successfully");
        models["maintains"].findByPk(1)
            .then( (results) => {
                console.log("results: " + JSON.stringify(results));
            })
    })
    .catch(function(err) {
        console.error("sequelize:error: <"+err+">");
    })

    .catch(db.sequelize.ConnectionTimedOutError, err => {
        console.log("Connection Timed out error loading: " + err.sql);
    })
    .catch(db.sequelize.TimeoutError, err => {
        console.log("Timeout error loading: " + err.sql);
    })
