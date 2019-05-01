'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const logger  = require('./modules/logger');
const uuid = require('uuid');
const path = require('path');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');

const https = require('https');
const fs = require('fs-extra');

let client = redis.createClient();
const cors = require('cors');
const PORT =5000;


const maintain = require('./router/maintain');
const part = require('./router/part');
const user = require('./router/user');
const todo = require('./router/todo');
const toto = require('./router/intoto');

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


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// dev or production:
// if ( process.env.NODE_ENV ==)
logger.info("env: " + process.env.NODE_ENV);
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

}

app.use(session(configSession));

// temporary no affect to jquery error yet
app.use(express.static(path.join(__dirname, 'public')));
//logger.info("dirname: " + __dirname);

// init cookies in redis and user if server went down
app.use((req,res,next) => {
    logger.info("server use called: " );
    next();
});
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: false
}));


app.use('/test', (req,res) => {
    logger.info("server / called test.html at: " +__dirname+'/public/view/test.html');
    res.sendFile(__dirname+'/public/view/test.html');
});

app.use('/maintain',maintain);
app.use('/part',part);
app.use('/user',user);
app.use('/todo',todo);
app.use('/toto',toto);

if ( process.env.NODE_ENV === 'development' ) {
    app.listen(PORT, () => {
        logger.info(`LISTEN: started on port ${PORT}`);
    });
}
else {
    // openssl req -nodes -new -x509 -keyout server.key -out server.cert
    https.createServer({
        key: fs.readFileSync('./keys/server.key'),
        cert: fs.readFileSync('./keys/server.cert')
    },app)
        .listen(PORT, () => {
            logger.info(`LISTEN: started on port ${PORT}`);
        });
}

module.exports = app;
