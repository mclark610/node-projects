const express = require('express');

const router = express.Router();
const logger = require('../modules/logger.js');
const user = require('../modules/data_user.js');
const _ = require("lodash");

const Status = require('../modules/status');

// TODO: create /user/destroy to destroy session
// TODO: check if user authorized to perform user maintenance

// middleware that is specific to this router
router.use((req,res,next) => {
    logger.info("user use called: ");

    next();
});

router.put('/set-active', (req,res) => {

    user.setStatus(req.body)
        .then( (results) => {
            logger.info("user:set-active: results:  " + results);

            let output = new Status("success",req.session["user"], results);

            res.send(output);
        })
        .catch( (err) => {
            logger.error("user:set-active: err: " +err);

            let output = new Status("failed",_.has(req.session, 'req.session.user') ? req.session["user"] : "undefined" , err );

            res.send(output);
        });
});

// delete tested with part deletion only. works
router.delete('/:id(\\d+)', (req,res) => {

    user.deleteUser(req.params["id"])
        .then( (results) => {
            logger.info("user:delete: " + req.params["id"] + "--- " + results);

            let output = new Status("success",_.has(req.session, 'req.session.user') ? req.session["user"] : "undefined" , results );

            res.send(output);
        })
        .catch( (err) => {
            logger.info("user:delete: " + JSON.stringify(err));

            let output = new Status("failed",_.has(req.session, 'req.session.user') ? req.session["user"] : "undefined" , err );

            res.send(output);
        });
});

router.get('/:id(\\d+)?', function (req, res) {

    user.fetch(req.params["id"])
        .then( (results) => {
            logger.info("user:get:results: " + results);

            let output = new Status("success",_.has(req.session, 'req.session.user') ? req.session["user"] : "undefined" , results );

            res.send(output);
        })
        .catch( (err) => {
            logger.info("user:get:err: " + err);

            let output = new Status("failed",req.session["user"], err);

            res.send(output);

        });
});

router.put('/', (req,res) => {
    // update
    user.update(req.body)
        .then( (results) => {
            logger.info("user:put:results: " + results);

            let output = new Status("success",_.has(req.session, 'req.session.user') ? req.session["user"] : "undefined" , results );

            res.send(output);
        })
        .catch( (err) => {
            logger.info("user:put:err: " + err);

            let output = new Status("failed",(!(req.session["user"]) ? "undefined" : req.session["user"]),err);

            res.send(output);

        });
});

// post user
router.post('/register', function (req, res) {

    user.register(req.body)
        .then( (results) => {
            logger.info("user:register:results: " + results);

            let output = new Status("success",_.has(req.session, 'req.session.user') ? req.session["user"] : "undefined" , results );

            res.send(output);
        })
        .catch( (err) => {
            logger.info("part catch err: " + err);

            let output = new Status("failed",_.has(req.session, 'req.session.user') ? req.session["user"] : "undefined" , err );

            res.send(output);
        });
});

router.post('/check', function (req, res) {
    logger.info("===========================================================");
    logger.info("user/login called---user: " );
    logger.info("sessionID: " + req.sessionID);
    logger.info("session cookie: " + JSON.stringify(req.session.cookie));
    logger.info("session.user: " + req.session["user"]);
    logger.info("store: " + JSON.stringify(req.session));
    logger.info("===========================================================");


    let output = new Status("success",_.has(req.session, 'req.session.user') ? req.session["user"]: "undefined",req.session["user"] );
    res.send(output);
});

router.post('/login', function (req,res) {
    let output;

    logger.info("+++++++++++++++++++++++++++++++++++++++++++++++++");
    logger.info("user/login called---session info below " );
    logger.info("  sessionID   : " + req.sessionID);
    logger.info("  session     : " + JSON.stringify(req.session));
    logger.info("  body        : " + JSON.stringify(req.body));
    logger.info("  user        : " + req.body["username"]);
    logger.info("  session key : " + req.session["key"]);
    // is user already logged in?
    // if user name matches in cookie
    // and if user key matches in cookie
    // then ignore existing login request

    if (_.has(req.session, 'req.session.key')) {
        logger.info("  login: session cookie key already exists");

        output = new Status("success",_.has(req.session, 'req.session.user') ? req.session["user"]: "undefined",req.session["user"] );

        res.send(output);
    }
    else {
        logger.info("key is not in req.session" + JSON.stringify(req.session));
        user.fetchByNamePassword(req.body["username"],req.body["password"])
            .then( (results) => {
                logger.info("  login:fetchByNamePassword success: " + JSON.stringify(results));

                req.session.cookie["user"] = req.body["username"];
                req.session["user"] = req.body["username"];
                if ( results.length > 0) {

                    req.session["key"]  = new Date().getTime();

                    output = new Status("success",_.has(req.session, 'req.session.user') ? req.session["user"]: "undefined",req.session["user"] );

                    res.send(output);
                }
                else {
                    output = new Status("failed",_.has(req.session, 'req.session.user') ? req.session["user"]: "undefined", JSON.stringify() );
                    res.send(output);
                }
            })
            .catch( (err) => {
                logger.info("results err: " + err);

                let output = new Status("failed",_.has(req.session, 'req.session.user') ? req.session["user"]: "undefined", err);

                res.send(output);
            });
    }
});

router.post('/logout', function(req,res) {
    let output;

    logger.info("user/logout called---user");
    logger.info("sessionID: " + req.sessionID);

    logger.info("session before: " + JSON.stringify(req.session));
    logger.info("session.user before: " + req.session.user);
    logger.info("store: " + JSON.stringify(req.session));

    req.session.destroy( (err) => {
        if (err) {
            logger.error("user:logout:destroy failed with error: " + JSON.stringify(err));
            logger.info("session: " + JSON.stringify(req.session));
            logger.info("session has check failed++++" + _.has(req.session, 'req.session.user'));

            output = new Status("failed", _.has(req.session, 'req.session.user') ? "req.session.user": 'undefined', err );
        }
        else {
            logger.info("user:logout success");
            logger.info("session has check success++++" + _.has(req.session, 'req.session.user'));
            output = new Status("success",_.has(req.session, 'req.session.user') ? "req.session.user" : 'undefined', "user logged out" );
        }
        res.send(output);
    });
});

module.exports = router;
