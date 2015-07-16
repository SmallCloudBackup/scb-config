var express = require('express');
var router = express.Router();
var async = require('async');
var core = require('scb-core');

/** Get list of defined services. */
router.get('/services', function(req, res, next) {
  async.waterfall([
    function requestServices (next) {
        core.core.listServices(next);
    },
    function sendResult(listOfServices, next) {
      console.log(arguments);
      if (listOfServices != null) {
        res.json({
          ok: true,
          services: listOfServices
        });
        next();
      }
    }
  ], next);
});

module.exports = router;
