'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const logger  = require('./modules/logger');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');
const redisClient = require('./modules/redis_server');
const cookieParser = require('cookie-parser');
const https = require('https');
const fs = require('fs-extra');
const cors = require('cors');

const env = require('dotenv').config();

const maintain = require('./router/maintain');
const part = require('./router/part');
const user = require('./router/user');
const todo = require('./router/todo');
const intoto = require('./router/intoto');

// get this from config
// This is for session cookies saved in
// redis.
// cookie:secure: for https
// user_sid: user session_id

let configSession = {
    key: 'session_id',
    secret: 'some-secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: true
    },
    genid: () => {
        return uuidv4();
    },
    store: new RedisStore({
        host:process.env.REDIS_SERVER,
        port: process.env.REDIS_PORT,
        client: redisClient
    })
};
let commonSession = session(configSession);

let app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// dev or production:
if ( process.env.NODE_ENV === 'production') {
    logger.info("setting cors for production");
    app.use(cors({origin: '*'}));
    app.set('trust proxy', 1);
    configSession.cookie.secure = true;
}
else {
    logger.info("setting cors for development");
    app.use(cors(
        {
            origin: 'http://localhost:3000',
            credentials: true
        }
    ));
    logger.info("NODE_ENV: " + process.env.NODE_ENV);

}

app.use(cookieParser());
app.use(commonSession);

// Everyones call uses this guy.
app.use( (req,res,next) => {
    logger.info("**************** APP USE *************************");

    next();
});

// temporary no affect to jquery error yet
app.use(express.static(path.join(__dirname, 'public')));
//logger.info("dirname: " + __dirname);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/maintain',maintain);
app.use('/part',part);
app.use('/user',user);
app.use('/todo',todo);
app.use('/intoto',intoto);

if ( process.env.NODE_ENV === 'development' ) {
    app.listen(process.env.PORT, () => {
        logger.info(`LISTEN: started on port ${process.env.PORT}`);
    });
}
else {
    // openssl req -nodes -new -x509 -keyout server.key -out server.cert
    https.createServer({
        key: fs.readFileSync('./keys/server.key'),
        cert: fs.readFileSync('./keys/server.cert')
    },app)
        .listen(process.env.PORT, () => {
            logger.info(`LISTEN: started on port ${process.env.PORT}`);
        });
}

module.exports = app;
