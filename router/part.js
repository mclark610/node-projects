const express = require('express');
const router = express.Router();

const logger = require('../modules/logger.js');
const part = require('../modules/data_part');

let option;

// middleware that is specific to this router
router.use((req,res,next) => {
    logger.info("part use called");
    // Check user is logged in.
    logger.info("part use called");
    logger.info("------------------ use -------------------------------------");
    logger.info("req.session: " + JSON.stringify(req.session));
    logger.info("------------------------------------------------------------");

    if (req.session["user"]) {
        option = {
            status: "success",
            user: req.session["user"]
        };

        logger.info("option: " + option);

        next();
    }
    else {
        option = {
            status: "fail",
            user: (req.session["user"] ? req.session["user"] : "")
        };
        res.send(option);
    }
});

router.put('/set-active', (req,res) => {

    part.setStatus(req.body)
        .then( (results) => {
            logger.info("part:set-active: results:  " + results);
            option = {
                status: "success",
                user: req.session["user"],
                data: results
            };

            res.send(option);
        })
        .catch( (err) => {
            logger.error("part:set-active: err: " +err);
            option = {
                status: "fail",
                user: (req.session["user"] ? req.session["user"] : ""),
                data: err
            };
            res.send(option);
        });
});

// delete tested with part deletion only. works
router.delete('/:id(\\d+)', (req,res) => {

    part.deletePart(req.params["id"])
        .then( (results) => {
            logger.info("part:delete: " + req.params["id"] + "--- " + results);
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

    part.fetch(req.params["id"])
        .then( (results) => {
            logger.info("part:get: results: " + results);
            option = {
                status: "success",
                user: req.session["user"],
                data: results
            };
            res.send(option);
        })
        .catch( (err) => {
            logger.info("part:get: err: " + err);
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
    part.update(req.body)
        .then( (results) => {
            logger.info( "part:results: " + results);
            option = {
                status: "success",
                user: req.session["user"],
                data: results
            };
            res.send(option);
        })
        .catch( (err) => {
            logger.info("part catch err: " + err);
            option = {
                status: "fail",
                user: (req.session["user"] ? req.session["user"] : ""),
                data: err
            };
            res.send(option);
        });
});

// post part
router.post('/', function (req, res) {
    part.insert(req.body)
        .then( (results) => {
            logger.info("part:results: " + JSON.stringify(results));
            option = {
                status: "success",
                user: req.session["user"],
                data: results
            };
            res.send(results);
        })
        .catch( (err) => {
            logger.info("part catch err: " + err);
            option = {
                status: "fail",
                user: (req.session["user"] ? req.session["user"] : ""),
                data: err
            };
            res.send(option);
        });
});

module.exports = router;
