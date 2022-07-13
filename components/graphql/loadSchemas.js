const {typeDefs} = require('./mergeTypeDefs.js');
const {resolvers}= require('./mergeResolvers.js');

const { makeExecutableSchema } = require("@graphql-tools/schema");

/*
console.log("----------------------------- typeDefs -------------------------------- ")
console.log(JSON.stringify(typeDefs));
console.log("----------------------------------------------------------------------- ")
*/

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: resolvers
})

console.log("schema is ");
console.log("-----------------------");
console.log(JSON.stringify(schema));
console.log("-----------------------");

module.exports.schema = schema;