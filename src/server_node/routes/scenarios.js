var express = require('express');
var models = require("../models");
var co  = require('co');
var router = express.Router();
var winston = require('winston');

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
 * @apiParam {Boolean} [archived] Whether to include retired content.
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
 * @apiSuccess {Boolean} rows.multitable If the Scenario is a multitable special or not.
 * @apiSuccess {Date} rows.archived_at Date on which the Scenario was archived. <code>null</code> if not archived.
 * 
 */
router.get('/', function(req, res, next) {
	if(req.query.rows && req.query.page && req.query.rows <= 20)
	{
		co(function *() {
			try {
				var findParams = {};
				findParams.where = {};
				
				// Handle 'rows' & 'page'
				if(typeof req.query.rows !== 'undefined' || typeof req.query.rows !== 'undefined') {
					if(req.query.rows > 0 && req.query.rows <= 20 && req.query.page > 0) {
						findParams.limit = parseInt(req.query.rows);
						findParams.offset = parseInt(req.query.page * req.query.rows - req.query.rows);
					} else {
						res.status(400).end();
					}
				} else {
					res.status(400).end();
				}
				
				// Handle 'search'
				if(typeof req.query.search !== 'undefined' && req.query.search !== '') {
					findParams.where.name = {$like: '%' + req.query.search + '%'};
				}
				
				// Handle 'orderBy' & 'order'
				var orderBy = 'season';
				var order = 'ASC';
				if(typeof req.query.orderBy !== 'undefined' && typeof req.query.order !== 'undefined') {
					if(req.query.orderBy === 'name' || req.query.order === 'season') {
						// Only allow 'name' or 'season'
						orderBy = req.query.orderBy;
					}
					
					if(req.query.order.toUpperCase() === 'ASC' || req.query.order.toUpperCase() === 'DESC') {
						// Only allow 'ASC' or 'DESC'
						order = req.query.order;
					}
					
					findParams.order = [ [ orderBy, order ] ];
				}
				
				// Handle 'retired'
				if(typeof req.query.retired === 'undefined' || req.query.retired !== 'true') {
					// If there is no retired toggle then do not include archived content
					findParams.where.archived_at = null;
				}
				
				// Handle 'specials'
				if(typeof req.query.specials === 'undefined' || req.query.specials !== 'true') {
					// If there is no specials toggle then do not include multitable content
					findParams.where.multitable = 0;
				}
				
				// Handle 'evergreen'
				if(typeof req.query.evergreen !== 'undefined' || req.query.evergreen === 'true') {
					// If there is a evergreen toggle then only include evergreen content
					findParams.where.evergreen = 1;
				}
				
				// Handle 'campaign'
				var campaign = 'PFS';
				if(typeof req.query.campaign !== 'undefined') {
					// Only allow 'PFS' or 'CORE'
					if(req.query.campaign.toUpperCase() === 'PFS' || req.query.campaign.toUpperCase() === 'CORE') {
						campaign = req.query.campaign.toUpperCase();
					}
				}
				
				// Handle 'season'
				if(typeof req.query.season !== 'undefined' && req.query.season.length > 0) {
					var seasons = req.query.season;
					findParams.where.season = {$in: seasons};
				}
				
				// Add authors to the result
				findParams.include = [];
				findParams.include.push({
					model: models.Author,
					as: 'authors',
					attributes: ['id', 'name'],
					//duplicating: false,
					order: [ ['name', 'ASC'] ]
				});
				
				// Handle 'author'
				if(typeof req.query.author !== 'undefined') {
					// Actually search and limit on author search
					findParams.include[0].where = {};
					findParams.include[0].where.name = {$like: '%' + req.query.author + '%'};
				}
				
				// Handle 'contenttypes'
				var contenttypes = [];
				if(typeof req.query.modules !== 'undefined') {
					// Module
					if(req.query.modules == 'true') {
						contenttypes.push('mod');
					}
				}
				
				if(typeof req.query.quests !== 'undefined') {
					// Quest
					if(req.query.quests == 'true') {
						contenttypes.push('quest');	
					}
				}
				
				if(typeof req.query.aps !== 'undefined') {
					// Adventure path
					if(req.query.aps == 'true') {
						contenttypes.push('ap');
					}
				}
				
				if(typeof req.query.scenarios !== 'undefined') {
					// Scenario
					if(req.query.scenarios == 'true') {
						contenttypes.push('scenario');	
					}
				}
				
				if(contenttypes.length > 0) {
					//TODO: Make sure this is not always included, if we don't have to limit, we should not add a where in
					findParams.where.type = {$in: contenttypes};
				}
			
				// Handle 'levels'
				if(typeof req.query.levels !== 'undefined') {
					findParams.where.levelrange = {$and: [{$like: '%' + req.query.levels[0] + '%'}]};
					
					if(req.query.levels.length === 2) {
					       findParams.where.levelrange.$and.push({$like: '%' + req.query.levels[1] + '%'});	
					}
				}
				
				// Handle 'groups'
				// The group and its members are fetched from the database and then split in players and added to the players to search on
				if(typeof req.query.group !== 'undefined') {
					var groupIds = req.query.group;
					
					var groups = yield models.Group.findAll({
						attributes: ['id'],
						where: {id: {$in: groupIds}},
						include: [{
							attributes: ['pfsnumber'],
							model: models.Person,
							as: 'members',
							through: 'j_group_person'
						}]
					});
					
					// Make sure req.query.players exists
					if(typeof req.query.player == 'undefined') {
						req.query.player = [];
					}
					
					groups.forEach(function(group) {
						group.members.forEach(function(member) {
							req.query.player.push(member.pfsnumber);
						});
					});
				}
				
				// Handle 'players'
				if(typeof req.query.player !== 'undefined') {
					var pfsnumbers = req.query.player;
					
					if(typeof req.query.showAll == 'undefined' || req.query.showAll !== 'true') {
						var subquery = '(SELECT `Scenario`.`id` FROM `scenarios` AS `Scenario` ' + 
							'INNER JOIN (`j_scenario_person` AS `players.played` ' + 
							'INNER JOIN `people` AS `players` ON `players`.`id` = `players.played`.`person_id` ' + 
							'AND ( ( `players.played`.`deleted_at` >= CURRENT_TIMESTAMP OR `players.played`.`deleted_at` IS NULL ) ' +
							'AND `players.played`.' + campaign + ' IS NOT NULL ) ' +
							') ON `Scenario`.`id` = `players.played`.`scenario_id` ' + 
							'AND ( ( `players`.`deleted_at` >= CURRENT_TIMESTAMP OR `players`.`deleted_at` IS NULL ) ' + 
							'AND `players`.`pfsnumber` IN (' + pfsnumbers.toString() + ') ) ' + 
							'WHERE ( `Scenario`.`deleted_at` >= CURRENT_TIMESTAMP OR `Scenario`.`deleted_at` IS NULL ) )';
						
						findParams.where.id = {$notIn: models.Sequelize.literal(subquery)};
					}
					
					// Add the GM at this point if the player searches for a GM as well
					if(typeof req.query.gm !== 'undefined') {
						pfsnumbers.push(req.query.gm);
					}
					
					findParams.include.push({
						model: models.Person,
						as: 'players',
						attributes: ['id', 'name', 'pfsnumber'],
						through: {
							as: 'played',
							attributes: ['pfs', 'pfs_gm', 'core', 'core_gm'],
						},
						duplicating: false,
						required: false,
						where: {pfsnumber: {$in: pfsnumbers}},
						order: [ ['name', 'ASC'] ]
					});
				}
				
				// If user only selects a GM
				if(typeof req.query.player === 'undefined' && typeof req.query.gm !== 'undefined') {
					findParams.include.push({
						model: models.Person,
						as: 'players',
						attributes: ['id', 'name', 'pfsnumber'],
						through: {
							as: 'played',
							attributes: ['pfs', 'pfs_gm', 'core', 'core_gm'],
						},
						duplicating: false,
						required: false,
						where: {pfsnumber: req.query.gm},
						order: [ ['name', 'ASC'] ]
					});
				}
				
				var scenarios = yield models.Scenario.findAndCountAll(findParams);
				
				res.status(200).send(scenarios);
			} catch (errors) {
				winston.log('error', errors);
				res.status(500).send(errors);
			}
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
		  		winston.log('error', '404!');
		  		res.status(404).end();
		  	}
		  	
	  }).catch(function(error) {
		  winston.log('error', error);
		  console.log(error);
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
			winston.log('error', error);
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

/**
 * @api {get} /scenarios/player/:pfsNumber/type/:typeId
 * @apiName GetScenariosPlayed
 * @apiGroup Scenarios
 */
router.get('/player/:pfsNumber/type/:typeId/season/:season', function(req, res, next) {
	if(req.params.type == 'quest') {
		var whereParam = {type: 'quest'};
	} else if(isNaN(req.params.season)) {
		var whereParam = {type: req.params.typeId};
	} else {
		var whereParam = {type: req.params.typeId, season: req.params.season};
	}
	
	models.Scenario.findAll({
		where: whereParam,
		include: [ { 
			model: models.Person, 
			as: 'players',
			attributes: ['name', 'pfsnumber'],
			where: {pfsnumber: req.params.pfsNumber},
			through: {
				as: 'played',
				attributes: ['pfs', 'pfs_gm', 'core', 'core_gm']
			},
			required: false
		} ],
		orderBy: [ [ 'number', 'ASC' ] ],
		attributes: ['id', 'name', 'number', 'season', 'archived_at']
	}).then(function(scenarios) {
		res.status(200).send(scenarios);
	}).catch(function(err) {
		winston.log('error', err);
		res.status(400).send(err);
	});
});

module.exports = router;
