const express = require('express');
const router = express.Router();

const logger = require('../modules/logger.js');
const user = require('../modules/data_user.js');

// TODO: create /user/destroy to destroy session


// middleware that is specific to this router
router.use((req,res,next) => {
    logger.info("user use called");
    next();
});

router.put('/set-active', (req,res) => {

    user.setStatus(req.body)
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

    user.deleteUser(req.params["id"])
        .then( (results) => {
            logger.info("delete: " + req.params["id"] + "--- " + results);
            res.send("router.delete this stuff!: " + req.params["id"]);
        })
        .catch( (err) => {
            res.send("router.delete error: " + err);
        });
});

router.get('/:id(\\d+)?', function (req, res) {

    user.fetch(req.params["id"])
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
    user.update(req.body)
        .then( (results) => {
            logger.log("info","results: " + results);
            res.send(results);
        })
        .catch( (err) => {
            logger.info("part catch err: " + err);
            res.send(err);
        });
});

// post user
router.post('/register', function (req, res) {
    user.insert(req.body)
        .then( (results) => {
            logger.log("info","results: " + results);
            res.send(results);
        })
        .catch( (err) => {
            logger.info("part catch err: " + err);
            res.send(err);
        });
});

router.post('/login', function (req, res) {
    logger.info("user/login called---user: " );
    logger.info("sessionID: " + req.sessionID);
    logger.info("session.id: " +req.session.id);
    logger.info("session cookie: " + JSON.stringify(req.session.cookie));
    logger.info("session.user before: " + req.session.user);
    logger.info("store: " + JSON.stringify(req.session));

    user.fetchByNamePassword(req.body["name"],req.body["password"])
        .then( (results) => {
            logger.info("results good: time to " + results);
            res.send(results);
        })
        .catch( (err) => {
            logger.info("results err: " + err);
            res.send(err);
        });

});

module.exports = router;
