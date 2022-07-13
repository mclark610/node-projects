const path = require('path');
const {print} = require('graphql');

const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeResolvers } = require('@graphql-tools/merge');

const resolversArray = loadFilesSync(path.join(__dirname, './resolvers'), { recursive: true,extensions: ['js']})

const resolvers = mergeResolvers(resolversArray);

//console.log("resolvers: " + JSON.stringify(resolvers));
module.exports = {resolvers};