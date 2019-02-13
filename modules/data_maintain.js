const logger = require('../modules/logger');
const models = require( '../models');

const { maintains } = models;

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

            //models["maintains"].findByPk(id)
            maintains.findByPk(id)
                .then( (results) => {
                    logger.info("results findByPk: " + JSON.stringify(results));
                    resolve(results);
                })
                .catch( (err) => {
                    logger.info("models[maintains] error: " + err);
                    reject(err);
                });
        }
        else {
            //models["maintains"].findAll({})
            maintains.findAll({})
                .then( (results) => {
                    logger.info("results findAll: " + JSON.stringify(results));
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
