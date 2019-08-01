// todo.js
const express = require('express');
const router = express.Router();

const logger = require('../modules/logger.js');
const todo = require('../modules/data_todo');
const _ = require("lodash");

const cookieParser = require('cookie-parser');

// TODO: create /user/destroy to destroy session
// TODO: check if user authorized to perform user maintenance

router.use(cookieParser());

// middleware that is specific to this router
router.use((req,res,next) => {

    // Check user is logged in.
    logger.info("todo use called");
    logger.info("------------------ use -------------------------------------");
    logger.info("req.session: " + JSON.stringify(req.session));
    logger.info("------------------------------------------------------------");

    if (_.has(req.session, 'req.session.user')) {
        next();
    }
    else {
        logger.info("todo:use:user: not available");
        res.status(403).send("unauthorized user");
    }
});


// delete tested with todo deletion only. works
router.delete('/:id(\\d+)', (req,res) => {
    todo.deletetodo(req.params["id"])
        .then( (results) => {
            logger.info("todo:delete: " + req.params["id"] + "--- " + results);
            res.status(200).send(results);
        })
        .catch( (err) => {
            logger.info("todo:delete: error: " + JSON.stringify(err));
            res.status(500).send(err);
        });
});

router.get('/:id(\\d+)?', function (req, res) {
    logger.info("todo: id: " + req.params["id"] );
    todo.fetch(req.params["id"])
        .then( (results) => {
            logger.info("todo:get: " + req.params["id"] + "--- " + results);
            res.status(200).send(results);
        })
        .catch( (err) => {
            logger.info("todo:get: error: " + JSON.stringify(err));
            res.status(500).send(err);
        });
});

router.put('/', (req,res) => {
    // update
    todo.update(req.body)
        .then( (results) => {
            logger.info("todo:put: " + req.params["id"] + "--- " + results);
            res.status(200).send(results);
        })
        .catch( (err) => {
            logger.info("todo:put: error: " + JSON.stringify(err));
            res.status(500).send(err);
        });
});

// post todo
router.post('/', function (req, res) {
    todo.insert(req.body)
        .then( (results) => {
            logger.info("todo:post: " + req.params["id"] + "--- " + results);
            res.status(200).send(results);
        })
        .catch( (err) => {
            logger.info("todo:post: error: " + JSON.stringify(err));
            res.status(500).send(err);
        });
});

module.exports = router;
