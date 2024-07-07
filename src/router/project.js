'use strict';

const express = require('express');
const router = express.Router();

const logger = require('../modules/logger.js');
const project = require('../modules/data_project.js');
const {authenticateUser} = require('../modules/authenticate');

/*
const { check, validationResult } = require('express-validator/check');

const { matchedData, sanitize } = require('express-validator/filter');
const { sanitizeBody } = require('express-validator/filter');
const { sanitizeQuery } = require('express-validator/filter');
const { sanitizeParam } = require('express-validator/filter');
*/

const _ = require('lodash');


// middleware that is specific to this router
router.use((req,res,next) => {
    logger.info("------------------ PROJECTS USE -------------------------------------");
    logger.info("req.session: " + JSON.stringify(req.session));
    logger.info("req.session.name: " + JSON.stringify(req.cookies.username));
    logger.info("project:use:sessionID  : " + JSON.stringify(req.sessionID));
    logger.info("project:use:session key: " + JSON.stringify(req.session.key));
    logger.info("project:use:username   : " + JSON.stringify(req.session.user));
    logger.info("------------------------------------------------------------");

    authenticateUser(req,res,next);
});

// delete tested with project deletion only. works
router.delete('/:id(\\d+)', (req,res) => {

    project.deleteProject(req.params["id"])
        .then( (results) => {
            logger.info("project:delete: " + req.params["id"] + "--- " + results);
            res.send("project:delete: " + req.params["id"]);
        })
        .catch( (err) => {
            res.status(403).send(err);
        });
});

router.get('/:id(\\d+)?', function (req,res) {
    logger.info("====================== get ================================");
    logger.info("project:get number of calls: "+ req.session.views);
    logger.info("project:get:req.session: " + JSON.stringify(req.session));
    logger.info("===========================================================");

    project.fetch(req.params["id"])
        .then( (results) => {
            logger.info("project:get:results: " + results);
            res.status(200).send(results);
        })
        .catch( (err) => {
            logger.info("project:err: " + err);
            res.status(500).send(err);

        });

});

router.put('/', (req,res) => {
    // update
    project.update(req.body)
        .then( (results) => {
            logger.info("project:put:results: " + results);
            res.status(200).send(results);
        })
        .catch( (err) => {
            logger.info("project:put:err: " + err);
            res.status(500).send(err);
        });
});

// post maintenance
router.post('/', function (req, res) {
    project.insert(req.body)
        .then( (results) => {
            logger.info("project:post:results: " + results);
            res.status(200).send(results);
        })
        .catch( (err) => {
            logger.info("project:post:err: " + err);
            res.status(500).send(err);
        });
});

module.exports = router;
