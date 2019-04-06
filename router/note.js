const express = require('express');
const router = express.Router();

const logger = require('../modules/logger.js');
const note = require('../modules/data_note');

let option;

// middleware that is specific to this router
router.use((req,res,next) => {
    // Check user is logged in.
    logger.info("note use called");
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
            user: (req.session["user"] ? req.session["user"] : ""),
            data: "note:use: session user not found"
        };

        logger.info("option in fail: " + JSON.stringify(option));
        res.send(option);
    }
});

router.put('/set-active', (req,res) => {

    note.setStatus(req.body)
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

// delete tested with note deletion only. works
router.delete('/:id(\\d+)', (req,res) => {

    note.deletenote(req.params["id"])
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

    note.fetch(req.params["id"])
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
    note.update(req.body)
        .then( (results) => {
            logger.info("note:put:results: " + results);
            option = {
                status: "success",
                user: req.session["user"],
                data: results
            };
            res.send(option);
        })
        .catch( (err) => {
            logger.info("note:put:err: " + err);
            option = {
                status: "fail",
                user: (req.session["user"] ? req.session["user"] : ""),
                data: err
            };

            res.send(option);

        });
});

// post note
router.post('/', function (req, res) {
    note.insert(req.body)
        .then( (results) => {
            logger.info("note:results: " + JSON.stringify(results));
            option = {
                status: "success",
                user: req.session["user"],
                data: results
            };

            res.send(results);
        })
        .catch( (err) => {
            logger.info("note:err: " + err);
            option = {
                status: "fail",
                user: (req.session["user"] ? req.session["user"] : ""),
                data: err
            };

            res.send(option);
        });
});

module.exports = router;
