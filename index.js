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

var configModules = {}, sourceModules = {};
var configRoots = [path.join(__dirname, "views")];
var staticPaths = [ path.join(__dirname, 'bower_components'), path.join(__dirname, 'public') ];

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
  var addRoot = false;
  if (m.services) {
    for (var mService in m.services) {
      var cm = m.services[mService].config;
      if (cm) {
        var cmObj = new cm();
        addRoot = true;
        configModules[mService] = cmObj;
      }
    }
  }
  if (m.sources) {
    for (var mService in m.sources) {
      var cm = m.sources[mService].config;
      if (cm) {
        var cmObj = new cm();
        addRoot = true;
        sourceModules[mService] = cmObj;
      }
    }
  }
  if (addRoot) {
    var modName = scbModules[moduleIdx];
    configRoots.push(path.join(__dirname, "node_modules", modName, "views"));
    var fs = require("fs");
    if (fs.existsSync(path.join(__dirname, "node_modules", modName, "public"))) {
      staticPaths.push(path.join(__dirname, "node_modules", modName, "public"));
    }
    if (fs.existsSync(path.join(__dirname, "node_modules", modName, "bower_components"))) {
      staticPaths.push(path.join(__dirname, "node_modules", modName, "bower_components"));
    }
  }
}
console.log(configRoots);

var moduleRouterFactory = require('./routes/service-config');

// view engine setup
app.set('views', configRoots);
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var oneDay = 86400000;

for (var i = 0; i < staticPaths.length; i++) {
  app.use(express.static(staticPaths[i], { maxAge: oneDay }));
}

app.use('/', routes);
app.use('/api', api);
app.use('/service-config', moduleRouterFactory('service', configModules).router);
app.use('/source-config', moduleRouterFactory('source', sourceModules).router);

module.exports = app;
