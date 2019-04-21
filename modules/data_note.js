const logger = require('../modules/logger');
const models = require( '../models');

const { notes } = models;


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
                logger.info("insertNote: validateNote failed with " + err);
                reject(err);
            });
    });
};

// tested manually works with id and no id
let fetch = (id) => {
    return new Promise( (resolve,reject) => {
        logger.info("fetchNote:id: " + id);
        // look for -1 for all or > -1 for one
        if (id) {
            //models["notes"].findByPk(id)
            notes.findByPk(id)
                .then( (results) => {
                    logger.info("fetchNote:findAll: success: " + JSON.stringify(results));
                    resolve(results);
                })
                .catch( (err) => {
                    logger.info("fetchNote:findByPk error: " + err);
                    reject(err);
                });
        }
        else {
            //models["notes"].findAll({})
            notes.findAll({})
                .then( (results) => {
                    logger.info("fetchNote:findAll: success: " + JSON.stringify(results));
                    resolve(results);
                })
                .catch( (err) => {
                    logger.info("fetchNote:findAll error: " + err);
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
                        logger.info("updateNote:results: " + results);
                        resolve(results);
                    })
                    .catch( (err) => {
                        logger.error("updateNote:error: " + err );
                        reject(err);
                    });
            })
            .catch( (err) => {
                logger.error("updateNote: validateNote: error: " + err );
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
                resolve("deleteNote: deleted id: " + id);
            })
            .catch( (err) => {
                logger.info("deleteNote:findByPk error: " + err);
                reject(err);
            });
    });
};

module.exports = {
    insert,
    fetch,
    update,
    deleteNote,
    notes
};
