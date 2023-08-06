const express = require('express');


const router = express.Router();
const logger = require('../modules/logger.js');
const user = require('../modules/data_user.js');
const _ = require("lodash");

const Status = require('../modules/status');
const {authenticateUser,createUserToken} = require('../modules/authenticate');
//const cookieParser = require('cookie-parser');


// middleware that is specific to this router
router.use((req,res,next) => {
    logger.info("***********************USER USE BEGIN ************************* ");
    // Check user is logged in.
    const username = req.body.username
    const authHeader = req.headers.authorization;
    logger.info("USE: username: " + username);
    logger.info("USE: authHeader: " + authHeader);
    logger.info("USE: req.session: " + JSON.stringify(req.session));
    logger.info("***********************USER USE END ************************* ");

    next();
});

router.get('/check', authenticateUser, (req, res) => {
  
    logger.info("===========================================================");
    logger.info("user/login called---user: " );
    logger.info("  user: " + JSON.stringify(req.username));
    logger.info("sessionID: " + req.sessionID);
    logger.info("session cookie: " + JSON.stringify(req.session.cookie));
    logger.info("===========================================================");
    res.status(200).send("/usr/check works!");
});

router.post('/login', function (req,res) {
    logger.info(" **********************LOGIN CALLED************************ ");
    logger.info("user/login called---session info below " );
    logger.info("  sessionID   : " + req.sessionID);
    logger.info("  session     : " + JSON.stringify(req.session));
    logger.info("  body        : " + JSON.stringify(req.body));
    logger.info("  user        : " + req.body["username"]);
    logger.info("  password    : " + req.body["password"]);
    logger.info("  session key : " + (_.has(req.session, 'req.session.key') ? "exists": "does not exist" ));
    logger.info("  cookie      : " +  JSON.stringify(req.cookies));
    logger.info('Signed Cookies: ', JSON.stringify(req.signedCookies));

    
    user.fetchByNamePassword(req.body["username"],req.body["password"])
        .then( (results) => {
            logger.info("results were a success " + JSON.stringify(results));
            // Try saving name to cookie and then check it.
           const token = createUserToken(req.body["username"]);
            
            logger.info("token: " + token);
            logger.info("results: " + JSON.stringify(results));

            res.status(200).send(token);
        })
        .catch( (err) => {
            
            logger.info("user:post:fetchByNamePassword error: " + err);
            res.status(500).send(err);
        });
});

router.get("/super-secure-resource",  (req,res) => {
    return res.status(401)
            .json({message:"Need to be logged in"})
});

// Use the authentication middleware for the protected route
router.get('/protected', authenticateUser, (req, res) => {
    res.json({ message: 'This is a user protected route.', user: req.user });
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

