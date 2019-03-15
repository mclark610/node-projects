'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const logger  = require('./modules/logger');
const uuid = require('uuid');
const path = require('path');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');

let client = redis.createClient();

const PORT =3000;


const maintain = require('./router/maintain');
const part = require('./router/part');
const user = require('./router/user');
const todo = require('./router/todo');
const note = require('./router/note');

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
const cors = require('cors');
app.use(cors({origin: '*'}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// dev or production:
logger.info("env: " + app.get('env'));
if ( app.get('env') === 'production') {
    app.set('trust proxy', 1);
    configSession.cookie.secure = true;
}

app.use(session(configSession));

// temporary no affect to jquery error yet
app.use(express.static(path.join(__dirname, 'public')));
logger.info("dirname: " + __dirname);
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
app.use('/note',note);

app.listen(PORT, () => {
    logger.info(`LISTEN: started on port ${PORT}`);
});

module.exports=app;
