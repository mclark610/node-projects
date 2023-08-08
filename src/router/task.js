// task.js
const express = require('express');
const router = express.Router();

const logger = require('../modules/logger.js');
const task = require('../modules/data_task.js');
const _ = require("lodash");

const cookieParser = require('cookie-parser');

router.use(cookieParser());

// middleware that is specific to this router
router.use((req,res,next) => {

    // Check user is logged in.
    logger.info("task use called");
    logger.info("------------------ use -------------------------------------");
    logger.info("req.session: " + JSON.stringify(req.session));
    logger.info("------------------------------------------------------------");

    if (_.has(req.session, 'req.session.user')) {
        next();
    }
    else {
        logger.info("task:use:user: not available");
        res.status(403).send("unauthorized user");
    }
});


// delete tested with task deletion only. works
router.delete('/:id(\\d+)', (req,res) => {
    task.deletetask(req.params["id"])
        .then( (results) => {
            logger.info("task:delete: " + req.params["id"] + "--- " + results);
            res.status(200).send(results);
        })
        .catch( (err) => {
            logger.info("task:delete: error: " + JSON.stringify(err));
            res.status(500).send(err);
        });
});

router.get('/:id(\\d+)?', function (req, res) {
    logger.info("task: id: " + req.params["id"] );
    task.fetch(req.params["id"])
        .then( (results) => {
            logger.info("task:get: " + req.params["id"] + "--- " + results);
            res.status(200).send(results);
        })
        .catch( (err) => {
            logger.info("task:get: error: " + JSON.stringify(err));
            res.status(500).send(err);
        });
});

router.put('/', (req,res) => {
    // update
    task.update(req.body)
        .then( (results) => {
            logger.info("task:put: " + req.params["id"] + "--- " + results);
            res.status(200).send(results);
        })
        .catch( (err) => {
            logger.info("task:put: error: " + JSON.stringify(err));
            res.status(500).send(err);
        });
});

// post task
router.post('/', function (req, res) {
    task.insert(req.body)
        .then( (results) => {
            logger.info("task:post: " + req.params["id"] + "--- " + results);
            res.status(200).send(results);
        })
        .catch( (err) => {
            logger.info("task:post: error: " + JSON.stringify(err));
            res.status(500).send(err);
        });
});

module.exports = router;
