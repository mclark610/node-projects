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
    // Check user is logged in.
    logger.info("maintain use called");
    logger.info("------------------ MAINTAIN USE -------------------------------------");
    logger.info("req.session: " + JSON.stringify(req.session));
    logger.info("req.session.name: " + JSON.stringify(req.cookies.username));
    logger.info("maintain:use:sessionID  : " + JSON.stringify(req.sessionID));
    logger.info("maintain:use:session key: " + JSON.stringify(req.session.key));
    logger.info("maintain:use:username   : " + JSON.stringify(req.session.user));
    logger.info("------------------------------------------------------------");

    if (_.has(req.session.user)) {
        logger.info("maintain:use:req.session.user: " + JSON.stringify(req.session.user));
        next();
    }
    else {
        if (!_.has(req.session.user)) {
            logger.info("maintain:user:req.session.user is undefined");
            return;
        }
        else {
            logger.info("maintain:use:option: " + JSON.stringify("user not authorized"));
        }
        res.status(403).send("unauthorized user");
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
            res.status(403).send(err);
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
            logger.info("maintain:get:results: " + results);
            res.status(200).send(results);
        })
        .catch( (err) => {
            logger.info("err: " + err);
            res.status(500).send(err);

        });

});

router.put('/', (req,res) => {
    // update
    maintain.update(req.body)
        .then( (results) => {
            logger.log("info","results: " + results);
            res.status(200).send(results);
        })
        .catch( (err) => {
            logger.info("maintain catch err: " + err);
            res.status(500).send(err);
        });
});

// post maintenance
router.post('/', function (req, res) {
    maintain.insert(req.body)
        .then( (results) => {
            logger.log("info","results: " + results);
            res.status(200).send(results);
        })
        .catch( (err) => {
            logger.info("maintain catch err: " + err);
            res.status(500).send(err);
        });
});

module.exports = router;
