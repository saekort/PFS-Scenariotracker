var express = require('express');
var models = require("../models");
var router = express.Router();
var winston = require('winston');

// Test
router.get('/', function(req, res, next) {
	/**models.Scenario.findAndCountAll({limit: 10, include: [{model: models.Report, as: 'reports'}, {model: models.Game, as: 'game'}, {model: models.Author, as: 'authors'}]})
		.then(function (games) {
			res.status(200).send(games);
		}).catch(function(error) {
			winston.log('error', error);
			res.status(400).end();
		});**/
		
	models.Person.findAndCountAll({limit: 10, include: [{model: models.Wanted, as: 'wanted'}]})
	.then(function (tests) {
		res.status(200).send(tests);
	}).catch(function(error) {
		winston.log('error', error);
		res.status(400).end();
	});
});

module.exports = router;