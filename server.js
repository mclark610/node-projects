
const logger  = require('./modules/logger');
const db = require('./models/index.js');
const _ = require('lodash');
const models = require( './models');


db.sequelize
    .authenticate()
    .then(function() {
        logger.info("sequelize: logged in successfully");
        //Print available models
        _.each( models["maintains"],(results) => {
            logger.info("model<" + results + ">");
        });
        models["maintains"].findByPk(1)
            .then( (results) => {
                logger.info("results: " + JSON.stringify(results));
            })
            .catch( (err) => {
                logger.info("models[maintains] error: " + err);
            });
    })
    .catch(function(err) {
        logger.info("sequelize:error: <"+err+">");
    })
    .catch(db.sequelize.ConnectionTimedOutError, err => {
        logger.info("Connection Timed out error loading: " + err.sql);
    })
    .catch(db.sequelize.TimeoutError, err => {
        logger.info("Timeout error loading: " + err.sql);
    });
