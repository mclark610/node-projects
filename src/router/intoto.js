'use strict';
/* intoto.js is messing with graphql using all tables
 *
 */
const {createHandler} = require( 'graphql-http/lib/use/express');
const express = require('express');
const router = express.Router();

const logger = require('../modules/logger.js');

const {authenticateUser}= require('../modules/authenticate.js');
const Part = require('../modules/data_part');

const { schema } = require("../components/graphql/loadSchemas.js");
const {resolvers} = require("../components/graphql/mergeResolvers.js");

router.use((req,res,next) => {
    authenticateUser(req,res,next)

    // Check user is logged in.
    logger.info("toto use called");
   // next();
});

router.get('/test',(req,res) => {
    logger.info("############################ toto/test called ##########################");
    Part.fetch(req.params["id"])
        .then((results) => {
            logger.info("results: " + JSON.stringify(results));
            res.send("toto/test called " + JSON.stringify(results));
        })
        .catch((err) => {
            logger.info("err: " + JSON.stringify(err));
            res.send("toto/test called " + JSON.stringify(err));
        });
});
 
router.use('/graphql', createHandler({
    schema: schema,
    rootValue: resolvers
}));

module.exports = router;
