const path = require('path');

const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeResolvers } = require('@graphql-tools/merge');

const resolversArray = loadFilesSync(path.join(__dirname, './resolvers'), { recursive: true,extensions: ['js']})

const resolvers = mergeResolvers(resolversArray);
const logger = require('../../modules/logger')

//logger.info("resolvers: " + JSON.stringify(resolvers));


module.exports = {resolvers};