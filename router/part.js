const express = require('express');
const router = express.Router();

const logger = require('../modules/logger.js');
const part = require('../modules/data_part');

// middleware that is specific to this router
router.use((req,res,next) => {
    logger.info("part use called");
    let option;
    // Check user is logged in.
    logger.info("part use called");
    logger.info("------------------ use -------------------------------------");
    logger.info("req.session: " + JSON.stringify(req.session));
    logger.info("------------------------------------------------------------");

    if (req.session["user"] && req.session["key"]) {
        option = {
            status: "success",
            user: req.session["user"],
            key:  req.session["key"]
        };
        logger.info("option: " + option);

        next();
    }
    else {
        option = {
            status: "fail",
            user: (req.session["user"] ? req.session["user"] : ""),
            key : (req.session["key "] ? req.session["key"] : "")
        };
        res.send(option);
    }
});

router.put('/set-active', (req,res) => {

    part.setStatus(req.body)
        .then( (results) => {
            logger.info("router.post /set-active: results:  " + results);
            res.send("set-active: " + results);
        })
        .catch( (err) => {
            logger.error("router.post /set-active: err: " +err);
            res.send("set-active: error: + err");
        });
});

// delete tested with part deletion only. works
router.delete('/:id(\\d+)', (req,res) => {

    part.deletePart(req.params["id"])
        .then( (results) => {
            logger.info("delete: " + req.params["id"] + "--- " + results);
            res.send("router.delete this stuff!: " + req.params["id"]);
        })
        .catch( (err) => {
            res.send("router.delete error: " + err);
        });
});

router.get('/:id(\\d+)?', function (req, res) {

    part.fetch(req.params["id"])
        .then( (results) => {
            logger.info("results: " + results);
            res.send(results);
        })
        .catch( (err) => {
            logger.info("err: " + err);
            res.send(err);

        });
});

router.put('/', (req,res) => {
    // update
    part.update(req.body)
        .then( (results) => {
            logger.log("info","results: " + results);
            res.send(results);
        })
        .catch( (err) => {
            logger.info("part catch err: " + err);
            res.send(err);
        });
});

// post maintenance
router.post('/', function (req, res) {
    part.insert(req.body)
        .then( (results) => {
            logger.log("info","results: " + results);
            res.send(results);
        })
        .catch( (err) => {
            logger.info("part catch err: " + err);
            res.send(err);
        });
});

module.exports = router;
