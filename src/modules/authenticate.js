const jwt = require('jsonwebtoken');
const logger = require('../modules/logger.js');
const user = require('../modules/data_user.js');

const secret_key = 'your-secret-key';

const createUserToken = (username) => {   
    logger.info("createUserToken:user: " + user)
    return jwt.sign({username:username}, secret_key, {expiresIn: '1h'});
}

const authenticateUser = (req, res, next) => {
    const authHeader = req.header('Authorization');
    logger.info("authenticateUser:authHeader: " + authHeader);


    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        logger.info("token: " + token);
        jwt.verify(token, secret_key, (err, user) => {
            if (err) {
                logger.info("authenticateUser:verify:err: " + err);
                return res.status(401).json({ message: 'Invalid token' });
            }
            logger.info("authenticateUser:verify:user: " + JSON.stringify(user));
            req.user = user;
            next();
        });
    }
    else {
        return res.status(401).json({ message: 'No token found' });
    }
};

exports.authenticateUser = authenticateUser;
exports.secret_key = secret_key;
exports.createUserToken = createUserToken;