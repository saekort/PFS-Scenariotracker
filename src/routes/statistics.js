var express = require('express');
var models = require("../models");
var co  = require('co');
var router = express.Router();
var winston = require('winston');
var env = process.env.NODE_ENV || 'development';
var path = require('path');
var config = require(path.join(__dirname, '..', 'config', 'server.json'))[env];

/**
 * @api {get} /statistics/:type GET a statistic
 * @apiName GetStatistic
 * @apiGroup Statistic
 * 
 * @apiParam {String="totals", "played_most", "evergreen", "player_complete_pfs", "gm_complete_pfs", "player_complete_core", "gm_complete_core"} type What statistic to get.
 * 
 * @apiError {400} BadRequest The request was not in a valid format.
 * @apiError {401} Unauthorized You are not allowed access to the Statistic. 
 */
router.get('/', function(req, res, next) {
	// All allowed statistic types
	var types = [
	             'totals',
	             'played_most',
	             'played_most_sfs',
	             'evergreen',
	             'evergreen_sfs',
	             'player_complete_pfs',
	             'gm_complete_pfs',
	             'player_complete_core',
	             'gm_complete_core',
	             'player_complete_sfs',
	             'gm_complete_sfs'
	             ];
	
	if(typeof req.query.type !== undefined && types.indexOf(req.query.type) > -1) {
		models.Statistic.findAll({
			where: {type: req.query.type},
			include: [ {model: models.Scenario, as: 'scenario'},
			           {model: models.Person, as: 'person'} ],
		}).then(function(statistics) {
			res.status(200).send(statistics);
		}).catch(function(error) {
			winston.log('error', error);
			res.status(400).send(error);
		});
	} else {
		res.status(400).end();
	}
});

router.get('/generate', function(req, res, next) {
	if(req.query.localkey !== config.localkey && config.localkey !== false) {
		res.status(403).end();
	} else {
		// All allowed statistic types
		var types = [
		             'totals',
		             'played_most',
		             'played_most_sfs',
		             'evergreen',
		             'evergreen_sfs',
		             'player_complete_pfs',
		             'gm_complete_pfs',
		             'player_complete_core',
		             'gm_complete_core',
		             'player_complete_sfs',
		             'gm_complete_sfs'
		             ];
		
		co(function *() {
			try {
				// Get total content
				var content_count = yield models.Scenario.count({where: {archived_at: null}});
				var pfs_content_count = yield models.Scenario.count({where: {archived_at: null, game: 'pfs'}});
				var sfs_content_count = yield models.Scenario.count({where: {archived_at: null, game: 'sfs'}});
				
				// Generate totals statistics
				yield models.Statistic.destroy({where: {type: 'totals'}});
				
				var player_count = yield models.Person.count();
				var totals_player_count = models.Statistic.build({
					type: 'totals',
					number: 1,
					comment: player_count
				});
				
				totals_player_count.save();
			
				var language_count = yield models.sequelize.query("SELECT COUNT(DISTINCT `country`) as 'count' FROM `people` WHERE (`deleted_at` >= CURRENT_TIMESTAMP OR `deleted_at` IS NULL) AND `country` IS NOT NULL AND `country` != ''", {type: models.sequelize.QueryTypes.COUNT});
				language_count = language_count[0][0].count;
				var totals_language_count = models.Statistic.build({
					type: 'totals',
					number: 2,
					comment: language_count
				});
				
				totals_language_count.save();
				
				var session_count_pfs = yield models.j_scenario_person.count({ where: { pfs: {$ne: null} } });
				var session_count_pfs_gm = yield models.j_scenario_person.count({ where: { pfs_gm: {$ne: null} } });
				var session_count_core = yield models.j_scenario_person.count({ where: { core: {$ne: null} } });
				var session_count_core_gm = yield models.j_scenario_person.count({ where: { core_gm: {$ne: null} } });
				var session_count_sfs = yield models.j_scenario_person.count({ where: { sfs: {$ne: null} } });
				var session_count_sfs_gm = yield models.j_scenario_person.count({ where: { sfs_gm: {$ne: null} } });
				var session_count = session_count_pfs + session_count_pfs_gm + session_count_core + session_count_core_gm + session_count_sfs + session_count_sfs_gm;
				
				var totals_session_count = models.Statistic.build({
					type: 'totals',
					number: 3,
					comment: session_count
				});
				
				totals_session_count.save();
						
				var character_count = yield models.Character.count();
				var totals_character_count = models.Statistic.build({
					type: 'totals',
					number: 4,
					comment: character_count
				});
				
				totals_character_count.save();
				
				// Generate most complete pfs pc statistics
				yield models.Statistic.destroy({where: {type: 'player_complete_pfs'}});
				
				var most_complete_pfs = yield models.sequelize.query("SELECT `people`.`id` as `id`, ( SELECT COUNT(`j_scenario_person`.`person_id`) as `count` FROM `j_scenario_person` INNER JOIN `scenarios` ON `j_scenario_person`.`scenario_id` = `scenarios`.`id` WHERE `j_scenario_person`.`person_id` = `people`.`id` AND `j_scenario_person`.`pfs` IS NOT NULL AND `scenarios`.`archived_at` IS NULL ) as 'pfs_played' FROM `people` GROUP BY `people`.`id` ORDER BY `pfs_played` DESC LIMIT 10", {type: models.sequelize.QueryTypes.SELECT});
				for(var i = 0; i < most_complete_pfs.length; i++) {
					yield models.Statistic.build({
						type: 'player_complete_pfs',
						person_id: most_complete_pfs[i].id,
						number: i + 1,
						comment: most_complete_pfs[i].pfs_played + '/' + pfs_content_count
					}).save();
				}
		
				// Generate most complete sfs pc statistics
				yield models.Statistic.destroy({where: {type: 'player_complete_sfs'}});
				
				var most_complete_sfs = yield models.sequelize.query("SELECT `people`.`id` as `id`, ( SELECT COUNT(`j_scenario_person`.`person_id`) as `count` FROM `j_scenario_person` INNER JOIN `scenarios` ON `j_scenario_person`.`scenario_id` = `scenarios`.`id` WHERE `j_scenario_person`.`person_id` = `people`.`id` AND `j_scenario_person`.`sfs` IS NOT NULL AND `scenarios`.`archived_at` IS NULL ) as 'sfs_played' FROM `people` GROUP BY `people`.`id` ORDER BY `sfs_played` DESC LIMIT 10", {type: models.sequelize.QueryTypes.SELECT});
				for(var i = 0; i < most_complete_sfs.length; i++) {
					yield models.Statistic.build({
						type: 'player_complete_sfs',
						person_id: most_complete_sfs[i].id,
						number: i + 1,
						comment: most_complete_sfs[i].sfs_played + '/' + sfs_content_count
					}).save();
				}
				
				// Generate most complete core pc statistics
				yield models.Statistic.destroy({where: {type: 'player_complete_core'}});
				
				var most_complete_core = yield models.sequelize.query("SELECT `people`.`id` as `id`, ( SELECT COUNT(`j_scenario_person`.`person_id`) as `count` FROM `j_scenario_person` INNER JOIN `scenarios` ON `j_scenario_person`.`scenario_id` = `scenarios`.`id` WHERE `j_scenario_person`.`person_id` = `people`.`id` AND `j_scenario_person`.`core` IS NOT NULL AND `scenarios`.`archived_at` IS NULL ) as 'core_played' FROM `people` GROUP BY `people`.`id` ORDER BY `core_played` DESC LIMIT 10", {type: models.sequelize.QueryTypes.SELECT});
				for(var i = 0; i < most_complete_pfs.length; i++) {
					yield models.Statistic.build({
						type: 'player_complete_core',
						person_id: most_complete_core[i].id,
						number: i + 1,
						comment: most_complete_core[i].core_played + '/' + pfs_content_count
					}).save();
				}
		
				// Generate most complete pfs gm statistics
				yield models.Statistic.destroy({where: {type: 'gm_complete_pfs'}});
				
				var most_complete_gm_pfs = yield models.sequelize.query("SELECT `people`.`id` as `id`, ( SELECT COUNT(`j_scenario_person`.`person_id`) as `count` FROM `j_scenario_person` INNER JOIN `scenarios` ON `j_scenario_person`.`scenario_id` = `scenarios`.`id` WHERE `j_scenario_person`.`person_id` = `people`.`id` AND `j_scenario_person`.`pfs_gm` IS NOT NULL AND `scenarios`.`archived_at` IS NULL ) as 'pfs_gmed' FROM `people` GROUP BY `people`.`id` ORDER BY `pfs_gmed` DESC LIMIT 10", {type: models.sequelize.QueryTypes.SELECT});
				for(var i = 0; i < most_complete_gm_pfs.length; i++) {
					yield models.Statistic.build({
						type: 'gm_complete_pfs',
						person_id: most_complete_gm_pfs[i].id,
						number: i + 1,
						comment: most_complete_gm_pfs[i].pfs_gmed + '/' + pfs_content_count
					}).save();
				}
				
				// Generate most complete core gm statistics
				yield models.Statistic.destroy({where: {type: 'gm_complete_core'}});
				
				var most_complete_gm_core = yield models.sequelize.query("SELECT `people`.`id` as `id`, ( SELECT COUNT(`j_scenario_person`.`person_id`) as `count` FROM `j_scenario_person` INNER JOIN `scenarios` ON `j_scenario_person`.`scenario_id` = `scenarios`.`id` WHERE `j_scenario_person`.`person_id` = `people`.`id` AND `j_scenario_person`.`core_gm` IS NOT NULL AND `scenarios`.`archived_at` IS NULL ) as 'core_gmed' FROM `people` GROUP BY `people`.`id` ORDER BY `core_gmed` DESC LIMIT 10", {type: models.sequelize.QueryTypes.SELECT});
				for(var i = 0; i < most_complete_gm_core.length; i++) {
					yield models.Statistic.build({
						type: 'gm_complete_core',
						person_id: most_complete_gm_core[i].id,
						number: i + 1,
						comment: most_complete_gm_core[i].core_gmed + '/' + pfs_content_count
					}).save();
				}
				
				// Generate most complete sfs gm statistics
				yield models.Statistic.destroy({where: {type: 'gm_complete_sfs'}});
				
				var most_complete_gm_sfs = yield models.sequelize.query("SELECT `people`.`id` as `id`, ( SELECT COUNT(`j_scenario_person`.`person_id`) as `count` FROM `j_scenario_person` INNER JOIN `scenarios` ON `j_scenario_person`.`scenario_id` = `scenarios`.`id` WHERE `j_scenario_person`.`person_id` = `people`.`id` AND `j_scenario_person`.`sfs_gm` IS NOT NULL AND `scenarios`.`archived_at` IS NULL ) as 'sfs_gmed' FROM `people` GROUP BY `people`.`id` ORDER BY `sfs_gmed` DESC LIMIT 10", {type: models.sequelize.QueryTypes.SELECT});
				for(var i = 0; i < most_complete_gm_sfs.length; i++) {
					yield models.Statistic.build({
						type: 'gm_complete_sfs',
						person_id: most_complete_gm_sfs[i].id,
						number: i + 1,
						comment: most_complete_gm_sfs[i].sfs_gmed + '/' + sfs_content_count
					}).save();
				}
		
				// Generate played PFS most statistics
				yield models.Statistic.destroy({where: {type: 'played_most'}});
				
				var played_most = yield models.sequelize.query("SELECT `scenarios`.`id` as `id`, ( SELECT COUNT( `j_scenario_person`.`scenario_id`) as `tempcount` FROM `j_scenario_person` WHERE `j_scenario_person`.`scenario_id` = `scenarios`.`id` ) as 'count' FROM `scenarios` WHERE `scenarios`.`archived_at` IS NULL AND `game` = 'pfs' GROUP BY `scenarios`.`id` ORDER BY `count` DESC LIMIT  10", {type: models.sequelize.QueryTypes.SELECT});
				for(var i = 0; i < played_most.length; i++) {
					yield models.Statistic.build({
						type: 'played_most',
						scenario_id: played_most[i].id,
						number: i + 1,
						comment: played_most[i].count
					}).save();
				}
				
				// Generate SFS played most statistics
				yield models.Statistic.destroy({where: {type: 'played_most_sfs'}});
				
				var played_most_sfs = yield models.sequelize.query("SELECT `scenarios`.`id` as `id`, ( SELECT COUNT( `j_scenario_person`.`scenario_id`) as `tempcount` FROM `j_scenario_person` WHERE `j_scenario_person`.`scenario_id` = `scenarios`.`id` ) as 'count' FROM `scenarios` WHERE `scenarios`.`archived_at` IS NULL AND `game` = 'sfs' GROUP BY `scenarios`.`id` ORDER BY `count` DESC LIMIT  10", {type: models.sequelize.QueryTypes.SELECT});
				for(var i = 0; i < played_most_sfs.length; i++) {
					yield models.Statistic.build({
						type: 'played_most_sfs',
						scenario_id: played_most_sfs[i].id,
						number: i + 1,
						comment: played_most_sfs[i].count
					}).save();
				}
		
				// Generate favorite PFS evergreens statistics
				yield models.Statistic.destroy({where: {type: 'evergreen'}});
				
				var evergreen = yield models.sequelize.query("SELECT `scenarios`.`id` as `id`, ( SELECT COUNT( `j_scenario_person`.`scenario_id`) as `tempcount` FROM `j_scenario_person` WHERE `j_scenario_person`.`scenario_id` = `scenarios`.`id` ) as 'count' FROM `scenarios` WHERE `scenarios`.`archived_at` IS NULL AND `scenarios`.`evergreen` = 1 AND `scenarios`.`game` = 'pfs' GROUP BY `scenarios`.`id` ORDER BY `count` DESC LIMIT  10", {type: models.sequelize.QueryTypes.SELECT});
				for(var i = 0; i < evergreen.length; i++) {
					yield models.Statistic.build({
						type: 'evergreen',
						scenario_id: evergreen[i].id,
						number: i + 1,
						comment: evergreen[i].count
					}).save();
				}
				
				// Generate favorite SFS evergreens statistics
				yield models.Statistic.destroy({where: {type: 'evergreen_sfs'}});
				
				var evergreen_sfs = yield models.sequelize.query("SELECT `scenarios`.`id` as `id`, ( SELECT COUNT( `j_scenario_person`.`scenario_id`) as `tempcount` FROM `j_scenario_person` WHERE `j_scenario_person`.`scenario_id` = `scenarios`.`id` ) as 'count' FROM `scenarios` WHERE `scenarios`.`archived_at` IS NULL AND `scenarios`.`evergreen` = 1 AND `scenarios`.`game` = 'sfs' GROUP BY `scenarios`.`id` ORDER BY `count` DESC LIMIT  10", {type: models.sequelize.QueryTypes.SELECT});
				for(var i = 0; i < evergreen_sfs.length; i++) {
					yield models.Statistic.build({
						type: 'evergreen_sfs',
						scenario_id: evergreen_sfs[i].id,
						number: i + 1,
						comment: evergreen_sfs[i].count
					}).save();
				}
				
				res.status(200).end();
			} catch (errors) {
				winston.log('error', errors);
				res.status(500).send(errors);
			}
		});
	}
});

module.exports = router;