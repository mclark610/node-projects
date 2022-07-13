
const path = require('path');
const {print} = require('graphql');

const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeTypeDefs } = require('@graphql-tools/merge');

//const {ScalarNameTypeDefinition } = require('graphql-scalars');
//const { typeDefs: scalarTypeDefs } = require('graphql-scalars');

const { ScalarNameTypeDefinition } = require('graphql-scalars');

const pathdir = path.join(__dirname,'./**/*.graphql');

console.log("pathdir: " + pathdir);
//const typesArray = loadFilesSync(path.join(__dirname, './typedefs/*.graphql'))

const typesArray = loadFilesSync(path.join(__dirname, './typedefs/*.graphql'), { recursive: true,extensions: ['graphql']  })
//const typeDefs = mergeTypeDefs(typesArray)

//console.log( "typesArray: " + JSON.stringify(typesArray));
//console.log("mergeTypeDefs: " + JSON.stringify(mergeTypeDefs(typesArray)));

const typeDefs = [
  ScalarNameTypeDefinition,
  mergeTypeDefs(typesArray),
]

const printTypeDefs = print(typeDefs);

/*
console.log("TYPEDEFS")
console.log("-----------------------");
console.log(printTypeDefs);
console.log("-----------------------");
*/

module.exports.typeDefs=typeDefs;