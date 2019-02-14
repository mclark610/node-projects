const express = require('express');
const router = express.Router();

const logger = require('../modules/logger.js');
const maintain = require('../modules/data_maintain');

// middleware that is specific to this router
router.use((req,res,next) => {
    logger.info("maintain use called");
    next();
});

router.put('/set-active', (req,res) => {

    maintain.setStatus(req.body)
        .then( (results) => {
            logger.info("router.post /set-active: results:  " + results);
            res.send("set-active: " + results);
        })
        .catch( (err) => {
            logger.error("router.post /set-active: err: " +err);
            res.send("set-active: error: + err");
        });
});

// delete tested with maintain deletion only. works
router.delete('/:id(\\d+)', (req,res) => {

    maintain.deleteMaintain(req.params["id"])
        .then( (results) => {
            logger.info("delete: " + req.params["id"] + "--- " + results);
            res.send("router.delete this stuff!: " + req.params["id"]);
        })
        .catch( (err) => {
            res.send("router.delete error: " + err);
        });
});

router.get('/:id(\\d+)?', function (req, res) {

    maintain.fetch(req.params["id"])
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
    maintain.update(req.body)
        .then( (results) => {
            logger.log("info","results: " + results);
            res.send(results);
        })
        .catch( (err) => {
            logger.info("maintain catch err: " + err);
            res.send(err);
        });
});

// post maintenance
router.post('/', function (req, res) {
    maintain.insert(req.body)
        .then( (results) => {
            logger.log("info","results: " + results);
            res.send(results);
        })
        .catch( (err) => {
            logger.info("maintain catch err: " + err);
            res.send(err);
        });
});

module.exports = router;
