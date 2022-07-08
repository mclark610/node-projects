const logger = require('./logger');
const models = require( '../models');
const { projects,todos } = models;

let setStatus= (body) => {
    // Check if id is number
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
                projects.create(results)
                    .then( (id) => {
                        resolve( `
                            "id": ${id},
                            "status": "success"
                            `);
                    });
            })
            .catch((err) => {
                logger.info("insertProject: validateProject failed with " + err);
                reject(err);
            });
    });
};

// tested manually works with id and no id
let fetch = (id) => {
    return new Promise( (resolve,reject) => {
        logger.info("fetchProject:id: " + id);
        // look for -1 for all or > -1 for one
        if (id) {
            //models["projects"].findByPk(id)
            projects.findByPk(id, {
                include: [{
                    model: todos,
                    as: 'todos'
                }],
            })
                .then( (results) => {
                    logger.info("fetchProject:findByPk: success: " + JSON.stringify(results));
                    resolve(results);
                })
                .catch( (err) => {
                    logger.info("fetchProject:findByPk error: " + err);
                    reject(err);
                });
        }
        else {
            //models["projects"].findAll({})
            projects.findAll({})
                .then( (results) => {
                    logger.info("fetchProject:findAll: success: " + JSON.stringify(results));
                    resolve(results);
                })
                .catch( (err) => {
                    logger.info("fetchProject:findAll error: " + err);
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
                projects.update(valbody, {where: {"id": body["id"]}
                })
                    .then( (results) => {
                        logger.info("updateProject:results: " + results);
                        resolve(results);
                    })
                    .catch( (err) => {
                        logger.error("updateProject:error: " + err );
                        reject(err);
                    });
            })
            .catch( (err) => {
                logger.error("updateProject: validateProject: error: " + err );
                reject(err);
            });
    });
};

// TODO: Need validation
// tested manually without validation works
let deleteProject = (id) => {
    return new Promise( (resolve, reject) => {
        projects.findByPk(id)
            .then( (results) => {
                return results.destroy();
            })
            .then( () => {
                resolve("deleteProject: deleted id: " + id);
            })
            .catch( (err) => {
                logger.info("deleteProject:findByPk error: " + err);
                reject(err);
            });
    });
};

module.exports = {
    insert,
    fetch,
    setStatus,
    update,
    deleteProject
};
