const logger = require('../modules/logger');
const models = require( '../models');
const { maintains,parts,notes,todos } = models;

let setStatus= (body) => {
    // Check if id is number
    if (( body["id"]) && !isNaN(parseInt(body["id"]))) {
        if ( body["status"] == "active" || body["status"] == "inactive" ) {
            return new maintains.update({"status":body["status"]}, {where: {"id": body["id"]}});
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
                maintains.create(results)
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
            //models["maintains"].findByPk(id)
            maintains.findByPk(id, {
                include: [{
                    model: parts,
                    as: 'parts'
                },{
                    model: notes,
                    as: 'notes'
                },{
                    model: todos,
                    as: 'todos'
                }],
            })
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
            //models["maintains"].findAll({})
            maintains.findAll({})
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
                maintains.update(valbody, {where: {"id": body["id"]}
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
let deleteMaintain = (id) => {
    return new Promise( (resolve, reject) => {
        maintains.findByPk(id)
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
    deleteMaintain
};
