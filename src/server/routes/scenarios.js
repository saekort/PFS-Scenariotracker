var express = require('express');
var router = express.Router();

/* GET scenarios listing */
router.get('/', function(req, res, next) {
  res.send('scenarios list');
});

module.exports = router;
