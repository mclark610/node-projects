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
            res.status(200).send(results);
        })
        .catch( (err) => {
            logger.info("user:delete: " + JSON.stringify(err));

            let output = new Status("failed",_.has(req.session, 'req.session.user') ? req.session["user"] : "undefined" , err );

            res.send(output);
        });
});

router.get('/:id(\\d+)?', function (req, res) {

    // Check user is logged in.
    logger.info("maintain use called");
    logger.info("------------------ use -------------------------------------");
    logger.info("req.session: " + JSON.stringify(req.session));
    logger.info("------------------------------------------------------------");
    if (_.has(req.session, 'req.session.user')) {
        // reserved
    }
    else {
        res.status(500).send("unauthorized user");
    }

    user.fetch(req.params["id"])
        .then( (results) => {
            logger.info("user:get: " + req.params["id"] + "--- " + results);
            res.status(200).send(results);
        })
        .catch( (err) => {
            logger.info("user:get: error: " + JSON.stringify(err));
            res.status(500).send(err);
        });
});

router.put('/', (req,res) => {
    // update
    user.update(req.body)
        .then( (results) => {
            logger.info("user:put: " + req.params["id"] + "--- " + results);
            res.status(200).send(results);
        })
        .catch( (err) => {
            logger.info("user:put: error: " + JSON.stringify(err));
            res.status(500).send(err);
        });
});


// This will be for admin
router.post('/register', function (req, res) {
    user.register(req.body)
        .then( (results) => {
            logger.info("user:post: " + req.data["id"] + "--- " + results);
            res.status(200).send(results);
        })
        .catch( (err) => {
            logger.info("user:post: register error: " + JSON.stringify(err));
            res.status(500).send(err);
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


    res.status(200).send("checked: see server log");
});

router.post('/login', function (req,res) {
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
        logger.info("login: session cookie key already exists: " + req.session.user);
        res.status(200).send(req.session.user);
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

                res.status(200).send(req.session.user);

            })
            .catch( (err) => {
                logger.info("user:post:fetchByNamePassword error: " + err);
                res.status(500).send(err);
            });

    }
});

router.post('/logout', function(req,res) {
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
            logger.info("user:post:logout error: " + JSON.stringify(err));
            res.status(500).send(err);
        }
        else {
            logger.info("user:logout success");
            res.status(200).send("user:logout:success");
        }
    });
});

module.exports = router;
