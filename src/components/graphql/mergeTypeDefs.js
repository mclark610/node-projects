
const path = require('path');
const {print} = require('graphql');

const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeTypeDefs } = require('@graphql-tools/merge');

//const {ScalarNameTypeDefinition } = require('graphql-scalars');
//const { typeDefs: scalarTypeDefs } = require('graphql-scalars');

const { ScalarNameTypeDefinition } = require('graphql-scalars');
const logger = require('../../modules/logger')

const pathdir = path.join(__dirname,'./**/*.graphql');

//logger.info("pathdir: " + pathdir);
//const typesArray = loadFilesSync(path.join(__dirname, './typedefs/*.graphql'))

const typesArray = loadFilesSync(path.join(__dirname, './typedefs/*.graphql'), { recursive: true,extensions: ['graphql']  })
//const typeDefs = mergeTypeDefs(typesArray)

//logger.info( "typesArray: " + JSON.stringify(typesArray));
//logger.info("mergeTypeDefs: " + JSON.stringify(mergeTypeDefs(typesArray)));

const typeDefs = [
  ScalarNameTypeDefinition,
  mergeTypeDefs(typesArray),
]


/*
const printTypeDefs = print(typeDefs);
logger.info("TYPEDEFS")
logger.info("-----------------------");
logger.info(printTypeDefs);
logger.info("-----------------------");
*/

module.exports.typeDefs=typeDefs;