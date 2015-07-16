/**
 * SmallCloudBackup - Application configuration interface
 *
 * This web application provides interface to configure SCB:
 * - sources
 * - transformation and versioning
 * - outputs
 */
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var routes = require('./routes/index');
var api = require('./routes/api');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var oneDay = 86400000;

app.use(express.static(path.join(__dirname, 'bower_components'), { maxAge: oneDay }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: oneDay }));

app.use('/', routes);
app.use('/api', api);

module.exports = app;
