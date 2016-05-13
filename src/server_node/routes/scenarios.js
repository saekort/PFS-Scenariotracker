var express = require('express');
var models = require("../models");
var router = express.Router();

/**
 * @api {get} /scenarios GET a group of scenarios
 * @apiName GetScenarios
 * @apiGroup Scenarios
 * 
 * @apiParam {Number} rows Amount of Scenarios to return. Max 20.
 * @apiParam {Number} page Page of Scenarios to return.
 * @apiParam {Search} [search] String to limit results to. Searches on `name`.
 * 
 */
router.get('/', function(req, res, next) {
	if(req.query.rows && req.query.page && req.query.rows <= 20)
	{
		var search = '';
		if(typeof req.query.search != 'undefined') {
			search = req.query.search;
		}
		
		models.Scenarios.findAndCountAll({
			where: models.sequelize.or({name: {$like: '%' + search + '%'}}),
			limit: parseInt(req.query.rows),
			offset: parseInt(req.query.page * req.query.rows - req.query.rows),	
			order: '`name` ASC'
		})
		.then(function(scenarios) {
			console.log(scenarios);
			res.status(200).send(scenarios);
		}).catch(function(error) {
			res.status(400).send(error);
		});
	} else {
		res.status(400).end();
	}
});

/**
 * @api {get} /scenarios/:scenarioId GET a scenario
 * @apiName GetScenario
 * @apiGroup Scenarios
 * 
 * @apiParam {Number} scenarioId Scenario's unique ID.
 */
router.get('/:scenarioId', function(req, res) {
	  models.Scenarios.findById(req.params.scenarioId)
	  .then(function (scenario) {
		  	if(scenario !== null)
		  	{
		  		res.status(200).send(scenario);
		  	}
		  	else
		  	{
		  		res.status(404).end();
		  	}
	  }).catch(function(error) {
		  res.status(400).end();
	  });		
});

/**
 * @api {post} /scenarios/ CREATE a scenario
 * @apiName CreateScenario
 * @apiGroup Scenarios
 * 
 * @apiParam {String} name Scenario's name.
 */
router.post('/', function(req, res, next){
	if(typeof req.body.name != 'undefined') 
	{
		models.Scenarios.create({
			name: req.body.name
		}).then(function(scenario) {
			res.set('Location', req.get('host') + '/api/scenarios/' + scenario.id);
			res.status(201).end();
		}).catch(function(error) {
			res.status(400).send(error);
		});
	}
	else
	{
		res.status(400).end();
	}
});

/**
 * @api {put} /scenarios/:scenarioId UPDATE a scenario
 * @apiName UpdateScenario
 * @apiGroup Scenarios
 *
 * @apiParam {Number} scenarioId Scenario's unique ID.
 */

/**
 * @api {delete} /scenarios/:scenarioId DELETE a scenario
 * @apiName DeleteScenario
 * @apiGroup Scenarios
 *
 * @apiParam {Number} scenarioId Scenario's unique ID.
 */

module.exports = router;
