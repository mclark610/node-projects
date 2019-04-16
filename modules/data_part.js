const logger = require('../modules/logger');
const models = require( '../models');
const { parts } = models;
logger.info("zzzzzzzzzzzzzzzzzzzzzzzzz data_part loaded zzzzzzzzzzzzzzzzzzzzzz");
let setStatus= (body) => {
    // Check if id is number
    if (( body["id"]) && !isNaN(parseInt(body["id"]))) {
        if ( body["status"] == "active" || body["status"] == "inactive" ) {
            return new parts.update({"status":body["status"]}, {where: {"id": body["id"]}});
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
                parts.create(results)
                    .then( (id) => {
                        resolve( `
                            "id": ${id},
                            "status": "success"
                            `);
                    });
            })
            .catch((err) => {
                logger.info("insertPart: validatePart failed with " + err);
                reject(err);
            });
    });
};

// tested manually works with id and no id
let fetch = (id) => {
    return new Promise( (resolve,reject) => {
        logger.info("fetchPart:id: " + id);
        // look for -1 for all or > -1 for one
        if (id) {
            //models["parts"].findByPk(id)
            parts.findByPk(id)
                .then( (results) => {
                    logger.info("fetchPart:findAll: success: " + JSON.stringify(results));
                    resolve(results);
                })
                .catch( (err) => {
                    logger.info("fetchPart:findByPk error: " + err);
                    reject(err);
                });
        }
        else {
            //models["parts"].findAll({})
            parts.findAll({})
                .then( (results) => {
                    logger.info("fetchPart:findAll: success: " + JSON.stringify(results));
                    resolve(results);
                })
                .catch( (err) => {
                    logger.info("fetchPart:findAll error: " + err);
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
                parts.update(valbody, {where: {"id": body["id"]}
                })
                    .then( (results) => {
                        logger.info("updatePart:results: " + results);
                        resolve(results);
                    })
                    .catch( (err) => {
                        logger.error("updatePart:error: " + err );
                        reject(err);
                    });
            })
            .catch( (err) => {
                logger.error("updatePart: validatePart: error: " + err );
                reject(err);
            });
    });
};

// TODO: Need validation
// tested manually without validation works
let deletePart = (id) => {
    return new Promise( (resolve, reject) => {
        parts.findByPk(id)
            .then( (results) => {
                return results.destroy();
            })
            .then( () => {
                resolve("deletePart: deleted id: " + id);
            })
            .catch( (err) => {
                logger.info("deletePart:findByPk error: " + err);
                reject(err);
            });
    });
};

module.exports = {
    insert,
    fetch,
    setStatus,
    update,
    deletePart,
    parts
};
