const express = require('express');
const path    = require('path');

const logging = require('./modules/logger');
const config  = require('config');

const models = require( './models');

const app = express();
