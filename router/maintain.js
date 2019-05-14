'use strict';

const express = require('express');
const router = express.Router();

const logger = require('../modules/logger.js');
const maintain = require('../modules/data_maintain.js');
//const cookieParser = require('cookie-parser');

// TODO: create /user/destroy to destroy session
// TODO: check if user authorized to perform user maintenance

//router.use(cookieParser());

const _ = require('lodash');

// middleware that is specific to this router
router.use((req,res,next) => {
    let option;
    // Check user is logged in.
    logger.info("maintain use called");
    logger.info("------------------ MAINTAIN USE -------------------------------------");
    logger.info("req.session: " + JSON.stringify(req.session));
    logger.info("req.session.name: " + JSON.stringify(req.cookies.username));
    logger.info("user:login:sessionID  : " + JSON.stringify(req.sessionID));
    logger.info("user:login:session key: " + JSON.stringify(req.session.key));
    logger.info("user:login:username   : " + JSON.stringify(req.session.user));

    logger.info("------------------------------------------------------------");
    if (_.has(req.session, 'req.session.user')) {
        logger.info("maintain:use:req.session.user: " + JSON.stringify(req.session.user));
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
});

// delete tested with maintain deletion only. works
router.delete('/:id(\\d+)', (req,res) => {

    maintain.deleteMaintain(req.params["id"])
        .then( (results) => {
            logger.info("delete: " + req.params["id"] + "--- " + results);
            res.send("router.delete this stuff!: " + req.params["id"]);
        })
        .catch( (err) => {
            res.send("router.delete error: " + err);
        });
});

router.get('/:id(\\d+)?', function (req,res) {
    logger.info("====================== get ================================");
    logger.info("maintain: number of calls: "+ req.session.views);
    //logger.info("req.session.cookie: " + JSON.stringify(req.session.cookie));
    logger.info("req.session: " + JSON.stringify(req.session));
    logger.info("===========================================================");

    maintain.fetch(req.params["id"])
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
    maintain.update(req.body)
        .then( (results) => {
            logger.log("info","results: " + results);
            res.send(results);
        })
        .catch( (err) => {
            logger.info("maintain catch err: " + err);
            res.send(err);
        });
});

// post maintenance
router.post('/', function (req, res) {
    maintain.insert(req.body)
        .then( (results) => {
            logger.log("info","results: " + results);
            res.send(results);
        })
        .catch( (err) => {
            logger.info("maintain catch err: " + err);
            res.send(err);
        });
});

module.exports = router;
