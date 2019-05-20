const express = require('express');

const router = express.Router();
const logger = require('../modules/logger.js');
const user = require('../modules/data_user.js');
const _ = require("lodash");

//const cookieParser = require('cookie-parser');

const Status = require('../modules/status');

// TODO: create /user/destroy to destroy session
// TODO: check if user authorized to perform user maintenance

//router.use(cookieParser());

// middleware that is specific to this router
router.use((req,res,next) => {
    logger.info("***********************USER USED CALLED************************* ");
    next();
});

// delete tested with part deletion only. works
router.delete('/:id(\\d+)', (req,res,next) => {
    let option;
    // Check user is logged in.
    logger.info("maintain use called");
    logger.info("------------------ use -------------------------------------");
    logger.info("req.session: " + JSON.stringify(req.session));
    logger.info("------------------------------------------------------------");
    if (_.has(req.session, 'req.session.user')) {
        next();
    }
    else {
        option = {
            status: "failed",
            user: req.session.user,
            message: "maintain user not available"
        };
        logger.info("maintain:use:option: " + JSON.stringify(option));
        res.send(option);
    }
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
    let option;
    // Check user is logged in.
    logger.info("maintain use called");
    logger.info("------------------ use -------------------------------------");
    logger.info("req.session: " + JSON.stringify(req.session));
    logger.info("------------------------------------------------------------");
    if (_.has(req.session, 'req.session.user')) {
        // reserved
    }
    else {
        option = {
            status: "failed",
            user: req.session.user,
            message: "maintain user not available"
        };
        logger.info("maintain:use:option: " + JSON.stringify(option));
        res.send(option);
    }
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


// This will be for admin
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

router.get('/temp-login', function (req,res) {
    let output;

    logger.info(" **********************LOGIN CALLED************************ ");
    logger.info("user/login called---session info below " );
    logger.info("  sessionID   : " + req.sessionID);
    logger.info("  session     : " + JSON.stringify(req.session));
    logger.info("  body        : " + JSON.stringify(req.body));
    logger.info("  user        : " + req.query["username"]);
    logger.info("  session key : " + (_.has(req.session, 'req.session.key') ? "yes": "no" ));
    logger.info("  cookie      : " +  JSON.stringify(req.cookie));
    logger.info('Signed Cookies: ', JSON.stringify(req.signedCookies));


    // is user already logged in?
    // if user name matches in cookie
    // and if user key matches in cookie
    // then ignore existing login request

    if (_.has(req.session, 'req.session.key')) {
        logger.info("login: session cookie key already exists");

        output = new Status("success",_.has(req.session, 'req.session.user') ? req.session["user"]: "undefined","already logged in" );

        res.json(output);
    }
    else {
        logger.info("login: new session");

        user.fetchByNamePassword(req.query["username"],req.query["password"])
            .then( (results) => {
                logger.info("(((((((((((((((((((((((( inside successfull fetch ))))))))))))))))))))))))");
                logger.info("results were a success " + JSON.stringify(results));
                logger.info("  session     : " + JSON.stringify(req.session));
                logger.info("  req.cookie  : " + JSON.stringify(req.session.cookie));
                req.session.cookie["user"] = req.query["username"];
                req.session["user"] = req.query["username"];
                //req.session["key"]  = new Date().getTime();
                req.session.key  = new Date().getTime();
                res.cookie('sessionID', req.session.key);
                res.json(results);
                logger.info("(((((((((((((((((((((((())))))))))))))))))))))))");

            })
            .catch( (err) => {
                logger.info("results were failed " + JSON.stringify(err));
                res.json(err);
            });

    }
});
router.get('/temp-logout', function(req,res) {
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

router.post('/login', function (req,res) {
    let output;

    logger.info(" **********************LOGIN CALLED************************ ");
    logger.info("user/login called---session info below " );
    logger.info("  sessionID   : " + req.sessionID);
    logger.info("  session     : " + JSON.stringify(req.session));
    logger.info("  body        : " + JSON.stringify(req.body));
    logger.info("  user        : " + req.body["username"]);
    logger.info("  session key : " + (_.has(req.session, 'req.session.key') ? "exists": "does not exist" ));
    logger.info("  cookie      : " +  JSON.stringify(req.cookies));
    logger.info('Signed Cookies: ', JSON.stringify(req.signedCookies));


    // is user already logged in?
    // if user name matches in cookie
    // and if user key matches in cookie
    // then ignore existing login request

    if (_.has(req.session, 'req.session.key')) {
        logger.info("login: session cookie key already exists");

        output = new Status("success",_.has(req.session, 'req.session.user') ? req.session["user"]: "undefined","already logged in" );

        res.json(output);
    }
    else {
        /*
        Serverside uses sessions to store data.  Pass key back to user for them to pass back when they want something
        */
        logger.info("login: new session");
        user.fetchByNamePassword(req.body["username"],req.body["password"])
            .then( (results) => {
                logger.info("results were a success " + JSON.stringify(results));
                req.session["user"] = req.body["username"];
                req.session.key  = new Date().getTime();

                req.cookies["username"] = req.body["username"];
                req.cookies["sessonID"] = req.sessionID;
                //req.cookies["heydee"] =  "Marko";
                logger.info("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
                logger.info("user:login:sessionID  : " + JSON.stringify(req.sessionID));
                logger.info("user:login:session key: " + JSON.stringify(req.session.key));
                logger.info("user:login:username   : " + JSON.stringify(req.session.user));
                logger.info("user:login:username cookies  : " + JSON.stringify(req.cookies["username"]));
                logger.info("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
                output = new Status("success",_.has(req.session, 'req.session.user') ? "req.session.user" : 'undefined', "user logged out" );

                res.send(output);

            })
            .catch( (err) => {
                logger.info("fetchByNamePassword results:  " + JSON.stringify(err));
                res.json(err);
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
