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

let fetchByNamePassword = (username,password) => {
    return new Promise( (resolve,reject) => {

        if (!username) {
            logger.info("missing username from body");
            reject(new Status("failed",username,"name missing"));
        }
        else if (!password) {
            logger.info("missing password from body");
            reject(new Status("failed",username,": password missing"));
        }
        else {
            logger.info("users in fetch");
            users.findOne({
                where: {
                    name: username
                }
            })
                .then((results) =>  {
                    let validpwd = encrypt.checkPassword(password,results.password);
                    logger.info("name: " + results.name);
                    logger.info("compare: " + validpwd);
                    if (validpwd == true) {
                        logger.info("findOne sending success");
                        resolve(new Status('success',results.name,results.email));
                    }
                    else {
                        logger.info("findone sending fail because of invalid password");
                        reject(new Status('failed',results.name,"invalid password"));
                    }
                })
                .catch((err) => {
                    logger.info("findOne sending error! error: "+ JSON.stringify(err));
                    reject(new Status('failed','undefined','error in finding user'));
                });
        }
    });
};

let fetch = (id) => {
    return new Promise( (resolve,reject) => {
        logger.info("fetchUser:id: " + id);
        // look for -1 for all or > -1 for one
        if (id) {
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
