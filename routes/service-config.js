function makeRouter(moduleType, configModules) {
    var express = require('express');
    this.router = express.Router();
    this.configModules = configModules;

    /* GET home page. */
    this.router.get('/', function(req, res) {
      // list known service config pages
      res.render('scb-' + moduleType + '-all', { modules: this.configModules });
    });

    for (var m in configModules) {
      console.log("Adding " + moduleType + " route to " + m);
      // root view
      this.router.get('/' + m, function (req, res) {
        res.render(configModules[m].config_view, {});
      });
      // extra views
      // api endpoints
      this.router.all('/' + m + '/api', function (req, res, next) {
        configModules[m].apiCall(req, res, next);
      });
    }

    return this;
}
module.exports = makeRouter;
