var express = require('express');
var models = require("../models");
var router = express.Router();

/**
 * @api {get} /scenarios/:id GET a scenario
 * @apiName GetScenario
 * @apiGroup Scenario
 * 
 * @apiParam {Number} id Scenario's unique ID.
 */
router.get('/:id', function(req, res) {
	  models.Scenario.findById(req.params.id)
	  .then(function (paint) {
		  	if(paint !== null)
		  	{
		  		res.status(200).send(paint);
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
 * @api {get} /scenarios GET a group of scenarios
 * @apiName GetScenarios
 * @apiGroup Scenario
 */
router.get('/', function(req, res, next) {
	models.Scenario.findAndCountAll()
	.then(function(scenarios) {
		res.status(200).send(scenarios);
	}).catch(function(error) {
		res.status(400).send(error);
	});
});

/**
 * @api {post} /scenarios/ CREATE a scenario
 * @apiName CreateScenario
 * @apiGroup Scenario
 */


/**
 * @api {put} /scenarios/:id UPDATE a scenario
 * @apiName UpdateScenario
 * @apiGroup Scenario
 *
 * @apiParam {Number} id Scenario's unique ID.
 */

/**
 * @api {delete} /scenarios/:id DELETE a scenario
 * @apiName DeleteScenario
 * @apiGroup Scenario
 *
 * @apiParam {Number} id Author's unique ID.
 */

module.exports = router;
