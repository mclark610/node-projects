'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const logger  = require('./modules/logger');
const PORT =3000;

const maintain = require('./router/maintain');


let app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());


app.use('/maintain',maintain);

let requireAuthentication = (req,res,next) => {
    logger.info("checking out authentication");
    next();
};

let loadUser = (req,res,next) => {
    logger.info("loading user");
    next();
};

app.all('*',requireAuthentication,loadUser);

app.all('/hey',(req,res,next) => {
    logger.info("hey there");
    next();
});

app.post('/hey', (req,res) => {
    logger.info("req: " + JSON.stringify(req.body.name));
    res.send("hey posted");
});

app.get('/hey',(req,res) => {
    logger.info("from GET hey");
    res.send("from Get Hey");
});

app.get('/', (req,res) => {
    logger.info("GET: '/' called");
    res.send('The start of something cool!');
});

app.get('/users/:userId(\\d+)/books/:bookId(\\d+)', (req,res) => {
    res.send( req.params);
});

app.get('/flights/:from-:to', (req,res) => {
    logger.info("flights: " + req.params.id);
    res.send(req.params);
});

app.get('/stuff/:huh', (req,res,next) => {
    logger.info('process stuff and send along to the next place');
    //res.json('{"woah": "dude"}');
    next();
}, (req,res) => {
    res.sendStatus(200,'second part stuff is ' + JSON.stringify(req.params));
});

app.get('/me',(req,res) => {
    res.download('./README.md');
});

app.route('/book')
    .get( (req,res) => {
        res.send('Get a random book');
    })
    .post( (req,res) => {
        res.send('Add a book');
    })
    .put( (req,res) => {
        res.send('Update the book');
    });

app.listen(PORT, () => {
    logger.info(`LISTEN: started on port ${PORT}`);
});

/*
const db = require('./models/index.js');
const _ = require('lodash');
const models = require( './models');
//TODO: add hot module replacement to webpack development

db.sequelize
    .authenticate()
    .then(function() {
        logger.info("sequelize: logged in successfully");
        //Print available models
        _.each( models["maintains"],(results) => {
            logger.info("model<" + results + ">");
        });
        models["maintains"].findByPk(1)
            .then( (results) => {
                logger.info("results: " + JSON.stringify(results));
            })
            .catch( (err) => {
                logger.info("models[maintains] error: " + err);
            });
    })
    .catch(function(err) {
        logger.info("sequelize:error: <"+err+">");
    })
    .catch(db.sequelize.ConnectionTimedOutError, err => {
        logger.info("Connection Timed out error loading: " + err.sql);
    })
    .catch(db.sequelize.TimeoutError, err => {
        logger.info("Timeout error loading: " + err.sql);
    });
*/
