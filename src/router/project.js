'use strict';

const express = require('express');
const router = express.Router();

const logger = require('../modules/logger.js');
const project = require('../modules/data_project.js');
//const cookieParser = require('cookie-parser');

// TODO: create /user/destroy to destroy session
// TODO: check if user authorized to perform user maintenance

//router.use(cookieParser());

const _ = require('lodash');

// middleware that is specific to this router
router.use((req,res,next) => {
    // Check user is logged in.
    logger.info("project use called");
    logger.info("------------------ PROJECTS USE -------------------------------------");
    logger.info("req.session: " + JSON.stringify(req.session));
    logger.info("req.session.name: " + JSON.stringify(req.cookies.username));
    logger.info("project:use:sessionID  : " + JSON.stringify(req.sessionID));
    logger.info("project:use:session key: " + JSON.stringify(req.session.key));
    logger.info("project:use:username   : " + JSON.stringify(req.session.user));
    logger.info("------------------------------------------------------------");

    if (_.has(req.session.user)) {
        logger.info("project:use:req.session.user: " + JSON.stringify(req.session.user));
    }
    else {
        if (!_.has(req.session.user)) {
            logger.info("project:user:req.session.user is undefined");

            res.status(403).send("unauthorized user: Please log in.");
        }
    }
});

// delete tested with project deletion only. works
router.delete('/:id(\\d+)', (req,res) => {

    project.deleteProject(req.params["id"])
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
    logger.info("project: number of calls: "+ req.session.views);
    //logger.info("req.session.cookie: " + JSON.stringify(req.session.cookie));
    logger.info("req.session: " + JSON.stringify(req.session));
    logger.info("===========================================================");

    project.fetch(req.params["id"])
        .then( (results) => {
            logger.info("project:get:results: " + results);
            res.status(200).send(results);
        })
        .catch( (err) => {
            logger.info("err: " + err);
            res.status(500).send(err);

        });

});

router.put('/', (req,res) => {
    // update
    project.update(req.body)
        .then( (results) => {
            logger.info("info","results: " + results);
            res.status(200).send(results);
        })
        .catch( (err) => {
            logger.info("project catch err: " + err);
            res.status(500).send(err);
        });
});

// post maintenance
router.post('/', function (req, res) {
    project.insert(req.body)
        .then( (results) => {
            logger.info("info","results: " + results);
            res.status(200).send(results);
        })
        .catch( (err) => {
            logger.info("project catch err: " + err);
            res.status(500).send(err);
        });
});

module.exports = router;
