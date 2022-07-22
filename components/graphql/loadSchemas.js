const {typeDefs} = require('./mergeTypeDefs.js');
const {resolvers}= require('./mergeResolvers.js');

const { makeExecutableSchema } = require("@graphql-tools/schema");
const logger = require('../../modules/logger')
/*
logger.info("----------------------------- typeDefs -------------------------------- ")
logger.info(JSON.stringify(typeDefs));
logger.info("----------------------------------------------------------------------- ")
*/

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: resolvers
})

// logger.info("loadSchemas:schema is : %s",JSON.stringify(schema));

module.exports.schema = schema;