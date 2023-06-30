const logger  = require('./logger');
const redis = require('redis');

const redisClient = redis.createClient({
    host: "localhost",
    port: 6379
});

redisClient.on('error', (error) => {
    logger.error(error.message);
});

redisClient.on('connect',()=>{
    logger.info('Successfully connected to redis');
});


module.exports = {
    redisClient
};
