const express = require('express');
const router = express.Router();
const Status = require('../modules/status');

const logger = require('../modules/logger.js');
const part = require('../modules/data_part');
const _ = require("lodash");
const cookieParser = require('cookie-parser');

// TODO: create /user/destroy to destroy session
// TODO: check if user authorized to perform user maintenance

router.use(cookieParser());

// middleware that is specific to this router
router.use((req,res,next) => {
    let option;
    // Check if user is logged in.
    logger.info("part use called");
    logger.info("------------------ use -------------------------------------");
    logger.info("req.session: " + JSON.stringify(req.session));
    logger.info("------------------------------------------------------------");

    if (_.has(req.session, 'req.session.user')) {
        option = new Status("success",req.session.user,"");
        next();
    }
    else {
        logger.info("part:use:option: " + JSON.stringify(option));
        option = new Status("failed",req.session.user,"part use user not available");
        res.send(option);
    }

    next();
});

// delete tested with part deletion only. works
router.delete('/:id(\\d+)', (req,res) => {
    let option;
    part.deletePart(req.params["id"])
        .then( (results) => {
            logger.info("part:delete: " + req.params["id"] + "--- " + results);

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

    part.fetch(req.params["id"])
        .then( (results) => {
            logger.info("part:get: results: " + results);
            option = new Status("success",req.session.user,results);
            res.send(option);
        })
        .catch( (err) => {
            logger.info("part:get: err: " + err);
            option = new Status("failed",req.session.user,err);

            res.send(option);

        });
});

router.put('/', (req,res) => {
    let option;
    part.update(req.body)
        .then( (results) => {
            logger.info( "part:results: " + results);
            option = new Status("success",req.session.user,results);
            res.send(option);
        })
        .catch( (err) => {
            logger.info("part catch err: " + err);
            option = new Status("failed",req.session.user,err);
            res.send(option);
        });
});

// post part
router.post('/', function (req, res) {
    let option;
    part.insert(req.body)
        .then( (results) => {
            logger.info("part:results: " + JSON.stringify(results));
            option = new Status("success",req.session.user,results);
            res.send(results);
        })
        .catch( (err) => {
            logger.info("part catch err: " + err);
            option = new Status("failed",req.session.user,err);
            res.send(option);
        });
});

module.exports = router;
