const logger = require('../modules/logger');
const models = require( '../models');
const { todos, parts, notes } = models;

let setStatus= (body) => {
    // Check if id is number
    if (( body["id"]) && !isNaN(parseInt(body["id"]))) {
        if ( body["status"] == "active" || body["status"] == "inactive" ) {
            return new todos.update({"status":body["status"]}, {where: {"id": body["id"]}});
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
                if (!results["err"]) {
                    todos.create(results)
                        .then( (id) => {
                            resolve( `
                                "id": ${id},
                                "status": "success"
                                `);
                        });
                }
            })
            .catch((err) => {
                logger.info("insertMaintain: validateMaintain failed with " + err);
                reject(err);
            });
    });
};

let fetch = (id) => {
    return new Promise( (resolve,reject) => {
        logger.info("fetchTodo:id: " + id);
        // look for -1 for all or > -1 for one
        if (id) {
            //models["maintains"].findByPk(id)
            todos.findByPk(id, {
                include: [{
                    model: parts,
                    as: 'parts'
                },{
                    model: notes,
                    as: 'notes'
                }
                /*,{
                    model: maintains,
                    as: 'maintains'
                }*/],
            })
                .then( (results) => {
                    logger.info("fetchTodos:findByPk: success: " + JSON.stringify(results));
                    resolve(results);
                })
                .catch( (err) => {
                    logger.info("fetchTodos:findByPk error: " + err);
                    reject(err);
                });
        }
        else {
            //models["maintains"].findAll({})
            todos.findAll({})
                .then( (results) => {
                    logger.info("fetchTodos:findAll: success: " + JSON.stringify(results));
                    resolve(results);
                })
                .catch( (err) => {
                    logger.info("fetchTodos:findAll error: " + err);
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
                todos.update(valbody, {where: {"id": body["id"]}
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
let deleteTodo = (id) => {
    return new Promise( (resolve, reject) => {
        todos.findByPk(id)
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
    deleteTodo
};
