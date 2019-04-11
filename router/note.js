const express = require('express');
const router = express.Router();

const logger = require('../modules/logger.js');
const note = require('../modules/data_note');

const Status = require('../modules/status');
const _ = require("lodash");



// middleware that is specific to this router
router.use((req,res,next) => {
    let option;
    // Check user is logged in.
    logger.info("note use called");
    logger.info("------------------ use -------------------------------------");
    logger.info("req.session: " + JSON.stringify(req.session));
    logger.info("------------------------------------------------------------");

    if (_.has(req.session, 'req.session.user')) {
        option = new Status("success",req.session.user,"use: continue on");

        logger.info("option: " + JSON.stringify(option));

        next();
    }
    else {
        logger.info("option in fail: " + JSON.stringify(option));
        option = new Status("fail",req.session.user,"use: session user not found");
        res.send(option);
    }
});

router.put('/set-active', (req,res) => {
    let option;

    note.setStatus(req.body)
        .then( (results) => {
            logger.info("note:set-active: results:  " + results);
            option = new Status("success",req.session.user,results);

            res.send(option);
        })
        .catch( (err) => {
            logger.error("note:set-active: err: " +err);
            option = new Status("failed",req.session.user,err);
            res.send(option);
        });
});

// delete tested with note deletion only. works
router.delete('/:id(\\d+)', (req,res) => {
    let option;

    note.deletenote(req.params["id"])
        .then( (results) => {
            logger.info("note:delete: " + req.params["id"] + "--- " + results);
            option = new Status("success",req.session.user,results);
            res.send(option);
        })
        .catch( (err) => {
            option = new Status("failed",req.session.user,err);
            res.send(option);
        });
});

router.get('/:id(\\d+)?', function (req, res) {
    let option;

    note.fetch(req.params["id"])
        .then( (results) => {
            logger.info("results: " + results);
            option = new Status("success",req.session.user,results);
            res.send(option);
        })
        .catch( (err) => {
            logger.info("err: " + err);
            option = new Status("failed",req.session.user,err);
            res.send(option);

        });
});

router.put('/', (req,res) => {
    let option;
    // update
    note.update(req.body)
        .then( (results) => {
            logger.info("note:put:results: " + results);
            option = new Status("success",req.session.user,results);
            res.send(option);
        })
        .catch( (err) => {
            logger.info("note:put:err: " + err);
            option = new Status("failed",req.session.user,err);
            res.send(option);

        });
});

// post note
router.post('/', function (req, res) {
    let option;
    note.insert(req.body)
        .then( (results) => {
            logger.info("note:results: " + JSON.stringify(results));
            option = new Status("success",req.session.user,results);
            res.send(option);
        })
        .catch( (err) => {
            logger.info("note:err: " + err);
            option = new Status("failed",req.session.user,err);
            res.send(option);
        });
});

module.exports = router;
