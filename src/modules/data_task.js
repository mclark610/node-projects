const logger = require('./logger');
const models = require( '../models');
const { tasks, parts, notes } = models;

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
                if (!results["err"]) {
                    tasks.create(results)
                        .then( (id) => {
                            resolve( `
                                "id": ${id},
                                "status": "success"
                                `);
                        });
                }
            })
            .catch((err) => {
                logger.info("data_task:insert:failed with " + err);
                reject(err);
            });
    });
};

let fetch = (id) => {
    return new Promise( (resolve,reject) => {
        logger.info("data_task:fetch:id: " + id);
        // look for -1 for all or > -1 for one
        if (id) {
            tasks.findByPk(id, {
                include: [{
                    model: parts,
                    as: 'parts'
                },{
                    model: notes,
                    as: 'notes'
                }],
            })
                .then( (results) => {
                    logger.info("data_task:fetch:findByPk: success: " + JSON.stringify(results));
                    resolve(results);
                })
                .catch( (err) => {
                    logger.info("data_task:fetch:findByPk error: " + err);
                    reject(err);
                });
        }
        else {
            //models["tas"].findAll({})
            tasks.findAll({})
                .then( (results) => {
                    logger.info("data_task:fetch:findAll: success: " + JSON.stringify(results));
                    resolve(results);
                })
                .catch( (err) => {
                    logger.info("data_task:fetch:findAll error: " + err);
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
                tasks.update(valbody, {where: {"id": body["id"]}
                })
                    .then( (results) => {
                        logger.info("data_task:update:results: " + results);
                        resolve(results);
                    })
                    .catch( (err) => {
                        logger.error("data_task:update:error: " + err );
                        reject(err);
                    });
            })
            .catch( (err) => {
                logger.error("data_task:update:err: " + err );
                reject(err);
            });
    });
};

// TODO: Need validation
// tested manually without validation works
let deleteTask = (id) => {
    return new Promise( (resolve, reject) => {
        tasks.findByPk(id)
            .then( (results) => {
                return results.destroy();
            })
            .then( () => {
                resolve("deleteTask: deleted id: " + id);
            })
            .catch( (err) => {
                logger.info("deleteTask:findByPk error: " + err);
                reject(err);
            });
    });
};

module.exports = {
    insert,
    fetch,
    update,
    deleteTask
};
