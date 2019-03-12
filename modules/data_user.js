const logger = require('../modules/logger');
const models = require( '../models');
const { users } = models;
const Op = require('sequelize').Op;

let setStatus= (body) => {
    // Check if id is number
    if (( body["id"]) && !isNaN(parseInt(body["id"]))) {
        if ( body["status"] == "active" || body["status"] == "inactive" ) {
            return new users.update({"status":body["status"]}, {where: {"id": body["id"]}});
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
                users.create(results)
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
// returns empty array if user/password not found
let fetchByNamePassword = (name,password) => {
    return new Promise( (resolve,reject) => {
        logger.info("user:fetchByNamePassword:name: " + name + "---password: " + password);
        if (name) {
            //models["users"].findByPk(id)
            users.findAll( {
                where:{
                    [Op.and]:[
                        {name: name},
                        {password: password}
                    ]
                }})
                .then( (results) => {
                    logger.info("user:findByNamePassword: success: " + JSON.stringify(results));
                    //
                    resolve(results);
                })
                .catch( (err) => {
                    logger.info("user:fetchByNamePassword: error: " + err);
                    reject(err);
                });
        }
    });
};

let fetch = (id) => {
    return new Promise( (resolve,reject) => {
        logger.info("fetchUser:id: " + id);
        // look for -1 for all or > -1 for one
        if (id) {
            //models["users"].findByPk(id)
            users.findByPk(id)
                .then( (results) => {
                    logger.info("fetchUser:findAll: success: " + JSON.stringify(results));
                    resolve(results);
                })
                .catch( (err) => {
                    logger.info("fetchUser:findByPk error: " + err);
                    reject(err);
                });
        }
        else {
            //models["users"].findAll({})
            users.findAll({})
                .then( (results) => {
                    logger.info("fetchUser:findAll: success: " + JSON.stringify(results));
                    resolve(results);
                })
                .catch( (err) => {
                    logger.info("fetchUser:findAll error: " + err);
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
                users.update(valbody, {where: {"id": body["id"]}
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
let deleteUser = (id) => {
    return new Promise( (resolve, reject) => {
        users.findByPk(id)
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
    fetchByNamePassword,
    setStatus,
    update,
    deleteUser
};
