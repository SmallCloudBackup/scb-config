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

var configModules = {};
var configRoots = ["views"];

// a bit of voodoo to list SCB modules
var scbSkipModules = {"scb-core": true, "scb-scheduler": true, "scb-backuper": true };
var scbModules = [];
var dependencies = require("./package").dependencies;
console.log(dependencies);
for (var dep in dependencies) {
  if (dep && dep.match(/scb-/) && !scbSkipModules[dep]) {
    scbModules.push(dep);
  }
}

for (var moduleIdx in scbModules) {
  var m = require(scbModules[moduleIdx]);
  if (m.service) {
    for (var mService in m.service) {
      var cm = m.service[mService].config;
      if (cm) {
        var cmObj = new cm();
        // TODO: what if the module was installed as some other module's dependency?
        configRoots.push(path.join(__dirname, "node_modules", scbModules[moduleIdx], "views"));
        configModules[mService] = cmObj;
      }
    }
  }
}
console.log(configRoots);

var serviceConfig = require('./routes/service-config');

// view engine setup
app.set('views', configRoots);
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var oneDay = 86400000;

app.use(express.static(path.join(__dirname, 'bower_components'), { maxAge: oneDay }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: oneDay }));

app.use('/', routes);
app.use('/api', api);
app.use('/service-config', serviceConfig(configModules).router);

module.exports = app;
