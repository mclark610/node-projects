// todo.js
const express = require('express');
const router = express.Router();

const logger = require('../modules/logger.js');
const todo = require('../modules/data_todo');
const _ = require("lodash");

const Status = require('../modules/status');

let option;
const cookieParser = require('cookie-parser');

// TODO: create /user/destroy to destroy session
// TODO: check if user authorized to perform user maintenance

router.use(cookieParser());

// middleware that is specific to this router
router.use((req,res,next) => {
    let option;
    // Check user is logged in.
    logger.info("todo use called");
    logger.info("------------------ use -------------------------------------");
    logger.info("req.session: " + JSON.stringify(req.session));
    logger.info("------------------------------------------------------------");

    if (_.has(req.session, 'req.session.user')) {
        next();
    }
    else {
        option = {
            status: "failed",
            user: req.session.user,
            message: "todo use user not available"
        };
        logger.info("todo:use:option: " + JSON.stringify(option));
        res.send(option);
    }
});


// delete tested with todo deletion only. works
router.delete('/:id(\\d+)', (req,res) => {
    let option;

    todo.deletetodo(req.params["id"])
        .then( (results) => {
            logger.info("note:delete: " + req.params["id"] + "--- " + results);
            option = new Status("success",req.session.user,"todo delete",results);
            res.send(option);
        })
        .catch( (err) => {
            option = new Status("failed",req.session.user,err);
            res.send(option);
        });
});

router.get('/:id(\\d+)?', function (req, res) {
    let option;
    logger.info("todo: id: " + req.params["id"] );
    todo.fetch(req.params["id"])
        .then( (results) => {
            logger.info("results: " + results);
            res.send(results);
        })
        .catch( (err) => {
            logger.info("err: " + err);
            option = new Status("failed",req.session.user,err);
            res.send(option);

        });
});

router.put('/', (req,res) => {
    // update
    todo.update(req.body)
        .then( (results) => {
            logger.info("todo:put:results: " + results);
            option = new Status("success",req.session.user,results);
            res.send(option);
        })
        .catch( (err) => {
            logger.info("todo:put:err: " + err);

            option = new Status("failed",req.session.user,err);
            res.send(option);

        });
});

// post todo
router.post('/', function (req, res) {
    let option;
    todo.insert(req.body)
        .then( (results) => {
            logger.info("todo:post:results: " + JSON.stringify(results));
            option = new Status("success",req.session.user,results);

            res.send(option);
        })
        .catch( (err) => {
            logger.info("todo:post:err: " + err);
            option = new Status("failed",req.session.user,err);

            res.send(option);
        });
});

module.exports = router;
