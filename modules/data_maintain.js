const logger = require('../modules/logger');
const db = require('../models/index.js');
const models = require( '../models');
const _ = require('lodash');

db.sequelize
    .authenticate()
    .then(function() {
        logger.info("sequelize: logged in successfully");
        //Print available models
//        _.each( models["maintains"],(results) => {
//            logger.info("model<" + results + ">");
//        });
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


let validateMaintain = (body) => {
    let results;
    return new Promise((resolve,reject) => {
        // TODO: empty JSON object reject
        if (!body) {
            results = {
                "id": -1,
                "err": "body empty"
            };
            reject(results);
        } else {
            resolve(body);
        }
    });
};

let saveMaintain = (body) => {
    return new Promise((resolve,reject) => {
        logger.info("saveMaintain: " + JSON.stringify(body));
        if ( body["id"] === -1) {
            resolve("save new record");
        }
        else {
            resolve("update existing record");
        }
        reject("nothing");

    });
};

let insertMaintain = (body) => {
    return new Promise( (resolve,reject) => {
        validateMaintain(body)
            .then((results) => {
                saveMaintain(results)
                    .then( (id) => {
                        resolve( `
                            "id": ${id},
                            "status": "success"
                            `);
                    });
            })
            .catch((err) => {
                logger.info("validateMaintain failed with " + err);
                reject(err);
            });
    });
};

let fetchMaintain = (id) => {
    return new Promise( (resolve,reject) => {
        logger.info("fetchMaintain:id: " + id);
        // look for -1 for all or > -1 for one
        if (id) {
            models["maintains"].findByPk(id)
                .then( (results) => {
                    logger.info("results: " + JSON.stringify(results));
                    resolve(results);
                })
                .catch( (err) => {
                    logger.info("models[maintains] error: " + err);
                    reject(err);
                });
        }
        else {
            models["maintains"].findAll({})
                .then( (results) => {
                    logger.info("results: " + JSON.stringify(results));
                    resolve(results);
                })
                .catch( (err) => {
                    logger.info("models[maintains] error: " + err);
                    reject(err);
                });
        }
    });
};

module.exports = {
    insertMaintain,
    fetchMaintain
};
