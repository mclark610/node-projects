const express = require('express');
const router = express.Router();

const logger = require('../modules/logger.js');
const user = require('../modules/data_user.js');

// TODO: create /user/destroy to destroy session


// middleware that is specific to this router
router.use((req,res,next) => {
    logger.info("user use called: ");

    next();
});

router.put('/set-active', (req,res) => {

    user.setStatus(req.body)
        .then( (results) => {
            logger.info("router.post /set-active: results:  " + results);
            res.send("set-active: " + results);
        })
        .catch( (err) => {
            logger.error("router.post /set-active: err: " +err);
            res.send("set-active: error: + err");
        });
});

// delete tested with part deletion only. works
router.delete('/:id(\\d+)', (req,res) => {

    user.deleteUser(req.params["id"])
        .then( (results) => {
            logger.info("delete: " + req.params["id"] + "--- " + results);
            res.send("router.delete this stuff!: " + req.params["id"]);
        })
        .catch( (err) => {
            res.send("router.delete error: " + err);
        });
});

router.get('/:id(\\d+)?', function (req, res) {

    user.fetch(req.params["id"])
        .then( (results) => {
            logger.info("results: " + results);
            res.send(results);
        })
        .catch( (err) => {
            logger.info("err: " + err);
            res.send(err);

        });
});

router.put('/', (req,res) => {
    // update
    user.update(req.body)
        .then( (results) => {
            logger.log("info","results: " + results);
            res.send(results);
        })
        .catch( (err) => {
            logger.info("part catch err: " + err);
            res.send(err);
        });
});

// post user
router.post('/register', function (req, res) {
    user.insert(req.body)
        .then( (results) => {
            logger.log("info","results: " + results);
            res.send(results);
        })
        .catch( (err) => {
            logger.info("part catch err: " + err);
            res.send(err);
        });
});

router.post('/check', function (req, res) {
    logger.info("===========================================================");
    logger.info("user/login called---user: " );
    logger.info("sessionID: " + req.sessionID);
    logger.info("session.id: " +req.session.id);
    logger.info("session cookie: " + JSON.stringify(req.session.cookie));
    logger.info("session.user: " + req.session["user"]);
    logger.info("store: " + JSON.stringify(req.session));
    logger.info("===========================================================");

    res.send(req.session);
});

router.post('/login', function (req, res) {
    let output = {
        status: "false",
        user: "",
        key: ""
    };
    logger.info("+++++++++++++++++++++++++++++++++++++++++++++++++");
    logger.info("user/login called---session info below " );
    logger.info("  sessionID   : " + req.sessionID);
    logger.info("  session     : " + JSON.stringify(req.session));
    logger.info("  body        : " + JSON.stringify(req.body));
    logger.info("  user        : " + req.body["username"]);
    logger.info("  password    : " + req.body["password"]);
    logger.info("  session key : " + req.session["key"]);
    // is user already logged in?
    // if user name matches in cookie
    // and if user key matches in cookie
    // then ignore existing login request
    if (!req.session["key"]) {
        user.fetchByNamePassword(req.body["username"],req.body["password"])
            .then( (results) => {
                logger.info("  login:fetchByNamePassword: " + JSON.stringify(results));

                req.session.cookie["user"] = req.body["username"];
                req.session["user"] = req.body["username"];
                if ( results.length > 0) {

                    req.session["key"]  = new Date().getTime();
                    output = {
                        status: "success",
                        user: req.session["user"],
                        key: req.session["key"]
                    };
                    logger.info("  End of fetch sessionID  : " + req.sessionID);
                    logger.info("  End of fetch session    : " + JSON.stringify(req.session));
                    logger.info("  End of fetch password   : " + req.body["password"]);
                    logger.info("  End of fetch cookie key : " + JSON.stringify(req.session.key));
                    logger.info("+++++++++++++++++++++++++++++++++++++++++++++++++");
                    res.send(output);
                }
                else {
                    output = {
                        status: "failed",
                        user: req.session["user"],
                        key: ""
                    };
                    res.send(output);
                }
            })
            .catch( (err) => {
                logger.info("results err: " + err);
                output = {
                    status: "failed: " + JSON.stringify(err),
                    user: req.session["user"],
                    key: ""
                };
                res.send(output);
            });
    }
    else {
        logger.info("  login: session cookie key already exists");
        output = {
            status: "failed: already logged in",
            user: req.session["user"],
            key: req.session["key"]
        };
        res.send(output);
    }
});

router.post('/logout', function(req,res) {
    let output = {
        status: "failed: ",
        user: req.session["user"],
        key: req.session["key"]
    };
    logger.info("user/logout called---user");
    logger.info("sessionID: " + req.sessionID);

    logger.info("session before: " + JSON.stringify(req.session));
    logger.info("session.user before: " + req.session.user);
    logger.info("store: " + JSON.stringify(req.session));

    req.session.destroy( (err) => {
        if (err) {
            logger.error("user:logout:destroy failed with error: " + JSON.stringify(err));
            output["status"] = "fail: " + JSON.stringify(err);
        }
        else {
            logger.info("user:logout success");
            output = {
                status: "success: ",
                user: "",
                key: ""
            };
        }
        res.send(output);
    });
});

module.exports = router;
