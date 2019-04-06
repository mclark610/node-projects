const express = require('express');
const router = express.Router();

const logger = require('../modules/logger.js');
const todo = require('../modules/data_todo');

let option;

// middleware that is specific to this router
router.use((req,res,next) => {
    // Check user is logged in.
    logger.info("todo use called");
    logger.info("------------------ use -------------------------------------");
    logger.info("req.session: " + JSON.stringify(req.session));
    logger.info("------------------------------------------------------------");

    if (req.session["user"]) {
        option = {
            status: "success",
            user: req.session["user"]
        };
        logger.info("option: " + JSON.stringify(option));

        next();
    }
    else {
        option = {
            status: "fail",
            user: (req.session["user"] ? req.session["user"] : "")
        };
        logger.info("todo:use:option: " + JSON.stringify(option));

        res.send(option);
    }
});

router.put('/set-active', (req,res) => {

    todo.setStatus(req.body)
        .then( (results) => {
            logger.info("note:set-active: results:  " + results);
            option = {
                status: "success",
                user: req.session["user"],
                data: results
            };

            res.send(option);
        })
        .catch( (err) => {
            logger.error("note:set-active: err: " +err);
            option = {
                status: "fail",
                user: (req.session["user"] ? req.session["user"] : ""),
                data: err
            };
            res.send(option);
        });
});

// delete tested with todo deletion only. works
router.delete('/:id(\\d+)', (req,res) => {

    todo.deletetodo(req.params["id"])
        .then( (results) => {
            logger.info("note:delete: " + req.params["id"] + "--- " + results);
            option = {
                status: "success",
                user: req.session["user"],
                data: results
            };
            res.send(option);
        })
        .catch( (err) => {
            option = {
                status: "fail",
                user: (req.session["user"] ? req.session["user"] : ""),
                data: err
            };
            res.send(option);
        });
});

router.get('/:id(\\d+)?', function (req, res) {
    logger.info("todo: id: " + req.params["id"] );
    todo.fetch(req.params["id"])
        .then( (results) => {
            logger.info("results: " + results);
            option = {
                status: "success",
                user: req.session["user"],
                data: results
            };
            res.send(option);
        })
        .catch( (err) => {
            logger.info("err: " + err);
            option = {
                status: "fail",
                user: (req.session["user"] ? req.session["user"] : ""),
                data: err
            };

            res.send(option);

        });
});

router.put('/', (req,res) => {
    // update
    todo.update(req.body)
        .then( (results) => {
            logger.info("todo:put:results: " + results);
            option = {
                status: "success",
                user: req.session["user"],
                data: results
            };
            res.send(option);
        })
        .catch( (err) => {
            logger.info("todo:put:err: " + err);
            option = {
                status: "fail",
                user: (req.session["user"] ? req.session["user"] : ""),
                data: err
            };

            res.send(option);

        });
});

// post todo
router.post('/', function (req, res) {
    todo.insert(req.body)
        .then( (results) => {
            logger.info("todo:results: " + JSON.stringify(results));
            option = {
                status: "success",
                user: req.session["user"],
                data: results
            };

            res.send(results);
        })
        .catch( (err) => {
            logger.info("todo:err: " + err);
            option = {
                status: "fail",
                user: (req.session["user"] ? req.session["user"] : ""),
                data: err
            };

            res.send(option);
        });
});

module.exports = router;
