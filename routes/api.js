var express = require('express');
var router = express.Router();
var async = require('async');
var core = require('scb-core');

/** Get list of defined services. */
router.get(/^\/(services|sources|sinks|notifications|jobs|tasks|transformations)/, function(req, res, next) {
  async.waterfall([
    function request (next) {
      // XXX a small hack thanks to english language - we just need to remove trailing S to get object type
      var type = req.params[0];
      core.core.list(type.substring(0, type.length - 1), next);
    },
    function sendResult(listOfServices, next) {
      if (listOfServices != null) {
        res.json({
          ok: true,
          objects: listOfServices
        });
        next();
      }
    }
  ], next);
});

router.get(/^\/(service|source|sink|notification|job|task|transformation)\/(\w+)/, function (req, res, next) {
  console.log("type=" + req.params[0] + " id=" + req.params[1]);
  async.waterfall([
    function requestObject (next) {
        core.core.getObjectById(req.params[0], req.params[1], next);
    },
    function sendResult(obj, next) {
      if (obj != null) {
        res.json({
          ok: true,
          object: obj
        });
        next();
      }
    }
  ], next);
})

module.exports = router;
