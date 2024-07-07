const express = require('express');
const router = express.Router();

const logger = require('../modules/logger.js');
const part = require('../modules/data_part');
const _ = require("lodash");
const {authenticateUser} = require("../modules/authenticate");

// middleware that is specific to this router
router.use((req,res,next) => {
    // Check if user is logged in.
    logger.info("part use called");
    logger.info("------------------ use -------------------------------------");
    logger.info("req.session: "      + JSON.stringify(req.session));
    logger.info("------------------------------------------------------------");

    authenticateUser(req,res,next);
});

// delete tested with part deletion only. works
router.delete('/:id(\\d+)', (req,res) => {
    part.deletePart(req.params["id"])
        .then( (results) => {
            logger.info("part:delete: " + req.params["id"] + "--- " + results);

            res.status(200).send(results);
        })
        .catch( (err) => {
            logger.info("part:delete: error: " + JSON.stringify(err));
            res.status(500).send(err);
        });
});

router.get('/:id(\\d+)?', function (req, res) {

    part.fetch(req.params["id"])
        .then( (results) => {
            logger.info("part:get: results: " + results);
            res.status(200).send(results);
        })
        .catch( (err) => {
            logger.info("part:get: error: " + JSON.stringify(err));
            res.status(500).send(err);
        });
});

router.put('/', (req,res) => {
    part.update(req.body)
        .then( (results) => {
            logger.info( "part:results: " + results);
            res.status(200).send(results);
        })
        .catch( (err) => {
            logger.info("part:put: error: " + JSON.stringify(err));
            res.status(500).send(err);
        });
});

// post part
router.post('/', function (req, res) {
    part.insert(req.body)
        .then( (results) => {
            logger.info("part:results: " + JSON.stringify(results));
            res.status(200).send(results);
        })
        .catch( (err) => {
            logger.info("part:post: error: " + JSON.stringify(err));
            res.status(500).send(err);
        });
});

module.exports = router;
