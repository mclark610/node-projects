'use strict';

const express = require('express');
const path    = require('path');

const logger  = require('./modules/logger');
const config  = require('config');
const db = require('./models/index.js');
const _ = require('lodash');
const models = require( './models');

const app = express();

db.sequelize
    .authenticate()
    .then(function() {
        console.log("sequelize: logged in successfully");
        //Print available models
        _.each( models["maintains"],(results) => {
            console.log("model<" + results + ">");
        })
        models["maintains"].findByPk(1)
            .then( (results) => {
                console.log("results: " + JSON.stringify(results));
            })
            .catch( (err) => {
                console.log("models[maintains] error: " + err);
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
