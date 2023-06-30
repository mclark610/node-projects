const express = require('express');
const router = express.Router();

const logger = require('../modules/logger.js');
const note = require('../modules/data_note');

const _ = require("lodash");

const cookieParser = require('cookie-parser');

// TODO: create /user/destroy to destroy session
// TODO: check if user authorized to perform user maintenance

router.use(cookieParser());


// middleware that is specific to this router
router.use((req,res,next) => {
    // Check user is logged in.
    logger.info("note use called");
    logger.info("------------------ use -------------------------------------");
    logger.info("req.session: " + JSON.stringify(req.session));
    logger.info("------------------------------------------------------------");

    if (_.has(req.session, 'req.session.user')) {
        logger.info("note:use:user: "+req.session.user);

        next();
    }
    else {
        logger.info("note:use:user: not available");
        res.status(403).send("unauthorized user");
    }
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
            logger.info("note:results: " + JSON.stringify(results));
            res.status(200).send(results);
        })
        .catch( (err) => {
            logger.info("note:get:err: " + JSON.stringify(err));
            res.status(500).send(err);
        });
});

module.exports = router;
