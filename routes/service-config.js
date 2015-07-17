function makeRouter(configModules) {
    var express = require('express');
    this.router = express.Router();
    this.configModules = configModules;

    /* GET home page. */
    this.router.get('/', function(req, res) {
      // list known service config pages
      res.render('scb-service-all', { modules: this.configModules });
    });

    for (var m in configModules) {
      console.log("Adding route to " + m);
      this.router.get('/' + m, function (req, res) {
        res.render(configModules[m].config_view, {});
      });
    }

    return this;
}
module.exports = makeRouter;
