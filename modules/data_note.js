const logger = require('../modules/logger');
const models = require( '../models');
const { notes } = models;

let setStatus= (body) => {
    // Check if id is number
    if (( body["id"]) && !isNaN(parseInt(body["id"]))) {
        if ( body["status"] == "active" || body["status"] == "inactive" ) {
            return new notes.update({"status":body["status"]}, {where: {"id": body["id"]}});
        }
    }
};

// TODO: needs work.  check for sql injection?
let validate = (body) => {
    let results;
    return new Promise((resolve,reject) => {
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

// manually tested: success
let insert = (body) => {
    return new Promise( (resolve,reject) => {
        validate(body)
            .then((results) => {
                notes.create(results)
                    .then( (id) => {
                        resolve( `
                            "id": ${id},
                            "status": "success"
                            `);
                    });
            })
            .catch((err) => {
                logger.info("insertMaintain: validateMaintain failed with " + err);
                reject(err);
            });
    });
};

// tested manually works with id and no id
let fetch = (id) => {
    return new Promise( (resolve,reject) => {
        logger.info("fetchMaintain:id: " + id);
        // look for -1 for all or > -1 for one
        if (id) {
            //models["notes"].findByPk(id)
            notes.findByPk(id)
                .then( (results) => {
                    logger.info("fetchMaintain:findAll: success: " + JSON.stringify(results));
                    resolve(results);
                })
                .catch( (err) => {
                    logger.info("fetchMaintain:findByPk error: " + err);
                    reject(err);
                });
        }
        else {
            //models["notes"].findAll({})
            notes.findAll({})
                .then( (results) => {
                    logger.info("fetchMaintain:findAll: success: " + JSON.stringify(results));
                    resolve(results);
                })
                .catch( (err) => {
                    logger.info("fetchMaintain:findAll error: " + err);
                    reject(err);
                });
        }
    });
};

// tested manually - works
let update = (body) => {
    return new Promise( (resolve,reject) => {
        logger.info("update: body: " + JSON.stringify(body));
        validate(body)
            .then( (valbody) => {
                notes.update(valbody, {where: {"id": body["id"]}
                })
                    .then( (results) => {
                        logger.info("updateMaintain:results: " + results);
                        resolve(results);
                    })
                    .catch( (err) => {
                        logger.error("updateMaintain:error: " + err );
                        reject(err);
                    });
            })
            .catch( (err) => {
                logger.error("updateMaintain: validateMaintain: error: " + err );
                reject(err);
            });
    });
};

// TODO: Need validation
// tested manually without validation works
let deleteNote = (id) => {
    return new Promise( (resolve, reject) => {
        notes.findByPk(id)
            .then( (results) => {
                return results.destroy();
            })
            .then( () => {
                resolve("deleteMaintain: deleted id: " + id);
            })
            .catch( (err) => {
                logger.info("deleteMaintain:findByPk error: " + err);
                reject(err);
            });
    });
};

module.exports = {
    insert,
    fetch,
    setStatus,
    update,
    deleteNote
};
