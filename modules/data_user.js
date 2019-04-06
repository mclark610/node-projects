const logger = require('../modules/logger');
const models = require( '../models');
const Status = require('./status');

const { users } = models;

const encrypt = require('../modules/encrypt_data');

let setStatus= (body) => {
    // Check if id is number
    if (( body["id"]) && !isNaN(parseInt(body["id"]))) {
        if ( body["status"] == "active" || body["status"] == "inactive" ) {
            return new users.update({"status":body["status"]}, {where: {"id": body["id"]}});
        }
    }
};

// manually tested: success
let register = (body) => {

    let options = {
        fields: ["name","password","description","status"]
    };

    return users.create(body,options);
};

// tested manually works with id and no id
// returns empty array if user/password not found
let fetchByNamePassword = (name,password) => {
    return new Promise( (resolve,reject) => {
        let output;

        logger.info("user:fetchByNamePassword:name: " + name + "---password: " + password);
        logger.info("user:fetchByNamePassword:name: " + name + "---pwd: " + password);

        if (!name) {
            reject({status:"failed",data:"name missing"});
        }
        else if (!password) {
            reject({status:"failed",data:"password missing"});
        }
        else {
            logger.info("users in fetch");
            users.findOne({
                where: {
                    name: name
                }
            })
                .then((results) =>  {
                    logger.info("results : " + JSON.stringify(results));
                    logger.info("password: " + password);
                    let validpwd = encrypt.checkPassword(password,results.password);
                    logger.info("name: " + results.name);
                    logger.info("compare: " + validpwd);
                    output = new Status('success',results.name,results.email);

                    resolve(output);
                })
                .catch((err) => {
                    logger.info("error: "+ err);
                    output = new Status('failed','undefined','error in finding user');
                    reject(output);
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
    logger.info("update: body: " + JSON.stringify(body));
    users.update(body, {where: {"id": body["id"]}});
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
    register,
    fetch,
    fetchByNamePassword,
    setStatus,
    update,
    deleteUser
};
