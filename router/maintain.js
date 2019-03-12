const express = require('express');
const router = express.Router();

const logger = require('../modules/logger.js');
const maintain = require('../modules/data_maintain.js');

// middleware that is specific to this router
router.use((req,res,next) => {
    let option;
    // Check user is logged in.
    logger.info("maintain use called");
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
        logger.info("user and key not found in session");
        option = {
            status: "fail",
            user: (req.session["user"] ? req.session["user"] : ""),
            key : (req.session["key "] ? req.session["key"] : "")
        };
        res.send(option);
    }

    //works
    //    if (!req.session["user"] ) {
    //        res.sendFile('/src/node-maintain/public/view/test.html');
    //    }
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

router.get('/:id(\\d+)?', function (req,res) {
    if ( req.session.views) {
        req.session.views++;
    }
    else {
        req.session.views = 1;
    }
    req.session.save();
    logger.info("====================== get ================================");
    logger.info("maintain: number of calls: "+ req.session.views);
    //logger.info("req.session.cookie: " + JSON.stringify(req.session.cookie));
    logger.info("req.session: " + JSON.stringify(req.session));
    logger.info("===========================================================");

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
