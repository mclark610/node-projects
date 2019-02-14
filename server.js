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

let requireAuthentication = (req,res,next) => {
    logger.info("checking out authentication");
    next();
};

let loadUser = (req,res,next) => {
    logger.info("loading user");
    next();
};

app.all('*',requireAuthentication,loadUser);

app.use('/maintain',maintain);

app.listen(PORT, () => {
    logger.info(`LISTEN: started on port ${PORT}`);
});
