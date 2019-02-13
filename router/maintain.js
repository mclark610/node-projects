const express = require('express');
const router = express.Router();

const logger = require('../modules/logger.js');
const maintain = require('../modules/data_maintain');

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    logger.info('Time: ', Date.now());
    next();
});

// TODO: mark maintenance status active or inactive
router.post('/set-active', (req,res) => {
    logger.info("status active or inactive");
});

// TODO: delete: remove maintenance containing id.
//               remove all from todo, doc, parts

router.get('/:id(\\d+)?', function (req, res) {

    maintain.fetchMaintain(req.params["id"])
        .then( (results) => {
            logger.info("results: " + results);
            res.send(results);
        })
        .catch( (err) => {
            logger.info("err: " + err);
            res.send(err);

        });

});

// post maintenance
router.post('/', function (req, res) {
    if (req.body["id"] > -1) {
        // TODO: update
    }
    else {
        // TODO: call save maintain:
        maintain.insertMaintain(req.body)
            .then( (results) => {
                logger.log("info","results: " + results);
                res.send(results);
            })
            .catch( (err) => {
                logger.info("maintain catch err: " + err);
                res.send(err);
            });
    }
});

module.exports = router;
