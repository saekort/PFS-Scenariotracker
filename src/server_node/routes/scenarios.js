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
 * @apiParam {Search} [search] Search string to limit the result to. Will search in Scenario <code>name</code> only.
 * @apiParam {String="name", "season"} [orderBy] By what field to order the response by. Defaults to <code>season</code>.
 * @apiParam {String="ASC","DESC"} [order] How to order the response. Defaults to <code>ASC</code>.
 * @apiParam {Boolean} [modules] Whether to include modules in the query.
 * @apiParam {Boolean} [quests] Whether to include quests in the query.
 * @apiParam {Boolean} [aps] Whether to include adventure paths in the query.
 * @apiParam {Boolean} [scenarios] Whether to include scenarios in the query. 
 * 
 * @apiSuccess {Number} count total number of Scenarios that match your query.
 * @apiSuccess {Object[]} rows resulting Scenarios.
 * @apiSuccess {Number} rows.id ID of the Scenario.
 * @apiSuccess {String} rows.name Name of the Scenario.
 * @apiSuccess {String} rows.description Description of the Scenario.
 * @apiSuccess {String="scenario","mod","ap","query"} rows.type Type of the Scenario.
 * @apiSuccess {Integer} rows.season Season of the Scenario. If not in a season, then this will show <code>99</code>.
 * @apiSuccess {Integer} rows.number Number of the Scenario in it's season.
 * @apiSuccess {String} rows.tier Tier of the Scenario.
 * @apiSuccess {String} rows.levelrange Levels allowed, seperated by <code>|</code>, of the Scenario.
 * @apiSuccess {String} rows.link Paizo store link for the Scenario.
 * @apiSuccess {Boolean} rows.evergreen If the Scenario is a evergreen or not.
 * @apiSuccess {Date} rows.archived_at Date on which the Scenario was archived. <code>null</code> if not archived.
 * 
 */
router.get('/', function(req, res, next) {
	if(req.query.rows && req.query.page && req.query.rows <= 20)
	{
		var findParams = {};
		
		// Handle 'rows'
		if(typeof req.query.rows !== 'undefined') {
			if(req.query.rows > 0 && req.query.rows <= 20) {
				findParams.limit = parseInt(req.query.rows);	
			} else {
				res.status(400).end();
			}
		} else {
			res.status(400).end();
		}
		
		// Handle 'search'
		var search = '';
		if(typeof req.query.search !== 'undefined') {
			//TODO: Remove the LIKE clause for 'search' if 'search' is not set for more DB efficiency
			search = req.query.search;
		}
		
		// Handle 'orderBy'
		var orderBy = 'season';
		if(typeof req.query.orderBy !== 'undefined') {
			if(req.query.orderBy === 'name' || req.query.order === 'season') {
				// Only allow 'name' or 'season'
				orderBy = req.query.orderBy	
			}
		}
		
		// Handle 'order'
		var order = 'ASC';
		if(typeof req.query.order != 'undefined') {
			if(req.query.order.toUpperCase() === 'ASC' || req.query.order.toUpperCase() === 'DESC') {
				// Only allow 'ASC' or 'DESC'
				order = req.query.order	
			}
		}
		
		// Handle 'contenttypes'
		var contenttypes = [];
		//TODO: Make the query parameter contenttypes a array instead of 4 seperate values
		if(typeof req.query.modules != 'undefined') {
			// Module
			if(req.query.modules == 'true') {
				contenttypes.push('mod');	
			}			
		}
		
		if(typeof req.query.quests != 'undefined') {
			// Quest
			if(req.query.quests == 'true') {
				contenttypes.push('quest');	
			}
		}
		
		if(typeof req.query.aps != 'undefined') {
			// Adventure path
			if(req.query.aps == 'true') {
				contenttypes.push('ap');
			}
		}
		
		if(typeof req.query.scenarios != 'undefined') {
			// Scenario
			if(req.query.scenarios == 'true') {
				contenttypes.push('scenario');	
			}
		}
		
		//TODO: If any of the contenttypes are set, limit the query with a WHERE IN clause
		models.Scenarios.findAndCountAll(findParams)
		// Do the database query
//		models.Scenarios.findAndCountAll({
//			where: models.sequelize.or({name: {$like: '%' + search + '%'}}),
//			offset: parseInt(req.query.page * req.query.rows - req.query.rows),	
//			order: [ [orderBy, order] ]
//		})
		.then(function(scenarios) {
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
