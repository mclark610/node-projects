'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const logger  = require('./modules/logger');
const uuid = require('uuid');

const RedisStore = require('connect-redis')(session);
const redis = require('redis');

let client = redis.createClient();

const PORT =3000;

const maintain = require('./router/maintain');
const part = require('./router/part');
const user = require('./router/user');

// get this from config
// This is for session cookies saved in
// redis.
// cookie:secure: for https
// user_sid: user session_id
let configSession = {
    key: 'session_id',
    secret: 'some-secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false
    },
    genid: (req) => {
        return uuid();
    },
    store: new RedisStore({
        client: client
    })
};

let app = express();

// dev or production:
logger.info("env: " + app.get('env'));
if ( app.get('env') === 'production') {
    app.set('trust proxy', 1);
    configSession.cookie.secure = true;
}

app.use(session(configSession));

// init cookies in redis and user if server went down
app.use((req,res,next) => {
    logger.info("app.js use: " );
    next();
});

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.use('/maintain',maintain);
app.use('/part',part);
app.use('/user',user);

app.listen(PORT, () => {
    logger.info(`LISTEN: started on port ${PORT}`);
});
