const express = require('express');
const router = express.Router();

const logger = require('../modules/logger.js');
const note = require('../modules/data_note');
const {authenticateUser} = require('../modules/authenticate');

const _ = require("lodash");

// middleware that is specific to this router
router.use((req,res,next) => {
    // Check user is logged in.
    logger.info("note:use: called");
    logger.info("------------------ use -------------------------------------");
    logger.info("req.session: " + JSON.stringify(req.session));
    logger.info("------------------------------------------------------------");
    authenticateUser(req,res,next);
});


// delete tested with note deletion only. works
router.delete('/:id(\\d+)', (req,res) => {

    note.deletenote(req.params["id"])
        .then( (results) => {
            logger.info("note:delete: " + req.params["id"] + "--- " + results);
            res.status(200).send(results);
        })
        .catch( (err) => {
            logger.info("note:delete: error: " + JSON.stringify(err));
            res.status(500).send(err);
        });
});

router.get('/:id(\\d+)?', function (req, res) {
    note.fetch(req.params["id"])
        .then( (results) => {
            logger.info("note:get:results: " + JSON.stringify(results));
            res.status(200).send(results);
        })
        .catch( (err) => {
            logger.info("note:get:err: " + JSON.stringify(err));
            res.status(500).send(err);
        });
});

router.put('/', (req,res) => {
    // update
    note.update(req.body)
        .then( (results) => {
            logger.info("note:put:results: " + JSON.stringify(results));
            res.status(200).send(results);
        })
        .catch( (err) => {
            logger.info("note:get:err: " + JSON.stringify(err));
            res.status(500).send(err);
        });
});

// post note
router.post('/', function (req, res) {
    note.insert(req.body)
        .then( (results) => {
            logger.info("note:post:results: " + JSON.stringify(results));
            res.status(200).send(results);
        })
        .catch( (err) => {
            logger.info("note:post:err: " + JSON.stringify(err));
            res.status(500).send(err);
        });
});

module.exports = router;
