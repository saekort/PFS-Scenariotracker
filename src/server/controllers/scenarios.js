var models = require('../models');
var express = require('express');
var router = express.Router();

/* GET scenarios listing */
router.get('/', function(req, res, next) {
	models.Scenario.all().then(function(scenarios) {
		console.log(models.Scenario);
		res.send(scenarios);
	});
});

router.get('/:scenario_id', function(req, res) {
	models.Scenario.find({
		where: {id: req.param('scenario_id')}
	}).then(function(scenario) {
		res.send(scenario);
	});
});

router.get('/test', function(req, res, next) {
	models.Scenario.findAll({where: {id: 1}}).then(function(scenario) {
		models.Author.findAll({where: {id: 5}}).then(function(author) {
			
		});
	});	
});

module.exports = router;