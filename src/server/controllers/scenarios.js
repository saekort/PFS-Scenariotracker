var models = require('../models');
var express = require('express');
var router = express.Router();

/* GET scenarios listing */
router.get('/', function(req, res, next) {
	console.log(models.test);
	models.Scenario.all().then(function(scenarios) {
		res.send(scenarios);
	});
});

module.exports = router;