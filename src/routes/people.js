var express = require('express');
var models = require("../models");
var bcrypt    = require('bcryptjs');
var co  = require('co');
var router = express.Router();
var winston = require('winston');

/**
 * @api {get} /people GET a group of people
 * @apiName GetPeople
 * @apiGroup People
 * 
 * @apiParam {Number} rows Amount of People to return. Max 20.
 * @apiParam {Number} page Page of People to return.
 * @apiParam {Search} [search] String to limit results to. Searches on `name` and `pfsnumber`.
 * 
 * @apiHeader {String} Authorization "Bearer " + [JSON Web Token (JWT)]
 */
router.get('/', function(req, res, next) {
	if(req.query.rows && req.query.page && req.query.rows <= 20)
	{
		var search = '';
		if(typeof req.query.search != 'undefined') {
			search = req.query.search;
		}		
		
		models.Person.findAndCountAll({
			where: models.sequelize.or({name: {$like: '%' + search + '%'}},{pfsnumber: {$like: '%' + search + '%'}}),
			limit: parseInt(req.query.rows),
			offset: parseInt(req.query.page * req.query.rows - req.query.rows),			
			order: [ ['name', 'ASC'], ['pfsnumber', 'ASC'] ]
		}).then(function(people) {
			res.status(200).send(people);
		}).catch(function(error) {
			winston.log('error', error);
			res.status(400).send(error);
		});
	} else {
		res.status(400).end();
	}
});

/**
 * @api {get} /people/:personId GET a person
 * @apiName GetPerson
 * @apiGroup People
 * 
 * @apiParam {Number} personId Person's unique ID.
 */
router.get('/:personId', function(req, res, next) {
	winston.log('info', 'entered getting person');
	if(typeof req.params.personId == 'number') {
		models.Person.find(req.params.personId)
		.then(function(person) {
		  	if(person !== null)
		  	{	
		  		res.status(200).send(person);
		  	}
		  	else
		  	{
		  		res.status(404).send('NotFoundError');
		  	}	  	
		}).catch(function(error) {
			winston.log('error', error);
			res.status(400).send(error);
		});
	} else {
		res.status(400).send();
	}
});

/**
 * @api {get} /people/pfs/:pfsNumber GET a person
 * @apiName GetPersonByPFSnumber
 * @apiGroup People
 * 
 * @apiParam {Number} pfsNumber Person's unique PFSnumber.
 */
router.get('/pfs/:pfsNumber', function(req, res, next) {
	winston.log('info', 'entered getting person (by pfsnumber)');
	models.Person.find({where: {pfsnumber: req.params.pfsNumber}})
	.then(function(person) {
	  	if(person !== null)
	  	{
	  		res.status(200).send(person);
	  	}
	  	else
	  	{
	  		res.status(404).send('NotFoundError');
	  	}	  	
	}).catch(function(error) {
		winston.log('error', error);
		res.status(400).send(error);
	});
});

/**
 * @api {get} /people/:pfsNumber/profile GET a person's profile
 * @apiName GetPersonProfile
 * @apiGroup People
 * 
 * @apiParam {Number} pfsNumber Person's unique PFSnumber.
 */
router.get('/:pfsNumber/profile', function(req, res, next) {
	if(typeof parseInt(req.params.pfsNumber) == 'number') {
		models.Person.find({
			attributes: ['id', 'name', 'pfsnumber', 'country', 'public', 'public_characters'],
			where: {pfsnumber: req.params.pfsNumber},
			raw: true
		}).then(function(person) {
			co(function *() {
				try {
					// Add public characters value
				  	if(person !== null)
				  	{	
				  		if(person.public_characters) {
					  		// Get Characters
					  		var characters = yield models.Character.findAll({
								attributes: ['id', 'name', 'number', 'level', 'faction', 'class', 'campaign', 'exp'],
								where: {player_id: person.id},
								order: [ ['number', 'ASC'] ]
							});
					  		
					  		person.characters = characters;
				  		}
				  	
				  		// Get all the totals
				  		var totals = {};
				  		totals.pfs = yield models.Report.count({
				  			where: {person_id: person.id, reporttype_id: 1},
				  			include: [{
				  			    model: models.Scenario, 
				  			    as: 'scenario',
			  			  		where: {archived_on: null, game_id: 1}
				  			}]
				  		});
				  		
				  		totals.pfs_gm = yield models.Report.count({
				  			where: {person_id: person.id, reporttype_id: 2},
						  	include: [{
						  	    model: models.Scenario, 
						  	    as: 'scenario',
						  	  where: {archived_on: null, game_id: 1}
						  	}]
				  		});
				  		
				  		totals.core = yield models.Report.count({
				  			where: {person_id: person.id, reporttype_id: 3},
						  	include: [{
						  	    model: models.Scenario, 
						  	    as: 'scenario',
					  			where: {archived_on: null, game_id: 1}
						  	}]
				  		});
				  		
				  		totals.core_gm = yield models.Report.count({
				  			where: {person_id: person.id, reporttype_id: 4},
						  	include: [{
						  	    model: models.Scenario, 
						  	    as: 'scenario',
					  			where: {archived_on: null, game_id: 1}
						  	}]
				  		});

				  		totals.pfs2 = yield models.Report.count({
				  			where: {person_id: person.id, reporttype_id: 1},
						  	include: [{
						  	    model: models.Scenario, 
						  	    as: 'scenario',
					  			where: {archived_on: null, game_id: 2}
						  	}]
				  		});
				  		
				  		totals.pfs2_gm = yield models.Report.count({
				  			where: {person_id: person.id, reporttype_id: 2},
						  	include: [{
						  	    model: models.Scenario, 
						  	    as: 'scenario',
					  			where: {archived_on: null, game_id: 2}
						  	}]
				  		});
				  		
				  		totals.sfs = yield models.Report.count({
				  			where: {person_id: person.id, reporttype_id: 1},
						  	include: [{
						  	    model: models.Scenario, 
						  	    as: 'scenario',
					  			where: {archived_on: null, game_id: 3}
						  	}]
				  		});
				  		
				  		totals.sfs_gm = yield models.Report.count({
				  			where: {person_id: person.id, reporttype_id: 2},
						  	include: [{
						  	    model: models.Scenario, 
						  	    as: 'scenario',
					  			where: {archived_on: null, game_id: 3}
						  	}]
				  		});
				  		
				  		person.totals = totals;
				  		
				  		var progression = [];
				  		
				  		// Add all season progression
				  		var seasons = 10;
				  		for(var i = 0; i < seasons+1; i++) {
				  			var seasonTotal = yield models.Scenario.count({where: {season: i, archived_on: null, type: 'scenario', game_id: 1}});
				  			var seasonPfs = yield models.sequelize.query("SELECT COUNT(`reports`.`id`) as `count` FROM `reports` INNER JOIN `scenarios` ON `reports`.`scenario_id` = `scenarios`.`id` WHERE `reports`.`reporttype_id` = 1 AND `reports`.`person_id` = " + person.id + " AND `scenarios`.`archived_on` IS NULL AND `scenarios`.`type` = 'scenario' AND `scenarios`.`game_id` = 1 AND `scenarios`.`season` = " + i, {type: models.sequelize.QueryTypes.SELECT});
				  			var seasonPfsGm = yield models.sequelize.query("SELECT COUNT(`reports`.`id`) as `count` FROM `reports` INNER JOIN `scenarios` ON `reports`.`scenario_id` = `scenarios`.`id` WHERE `reports`.`reporttype_id` = 2 AND `reports`.`person_id` = " + person.id + " AND `scenarios`.`archived_on` IS NULL AND `scenarios`.`type` = 'scenario' AND `scenarios`.`game_id` = 1 AND `scenarios`.`season` = " + i, {type: models.sequelize.QueryTypes.SELECT});
				  			var seasonCore = yield models.sequelize.query("SELECT COUNT(`reports`.`id`) as `count` FROM `reports` INNER JOIN `scenarios` ON `reports`.`scenario_id` = `scenarios`.`id` WHERE `reports`.`reporttype_id` = 3 AND `reports`.`person_id` = " + person.id + " AND `scenarios`.`archived_on` IS NULL AND `scenarios`.`type` = 'scenario' AND `scenarios`.`game_id` = 1 AND `scenarios`.`season` = " + i, {type: models.sequelize.QueryTypes.SELECT});
				  			var seasonCoreGm = yield models.sequelize.query("SELECT COUNT(`reports`.`id`) as `count` FROM `reports` INNER JOIN `scenarios` ON `reports`.`scenario_id` = `scenarios`.`id` WHERE `reports`.`reporttype_id` = 4 AND `reports`.`person_id` = " + person.id + " AND `scenarios`.`archived_on` IS NULL AND `scenarios`.`type` = 'scenario' AND `scenarios`.`game_id` = 1 AND `scenarios`.`season` = " + i, {type: models.sequelize.QueryTypes.SELECT});
				  			
				  			var newSeason = {};
					  		newSeason.name = 'Season ' + i;
					  		newSeason.total = seasonTotal;
					  		newSeason.pfs = seasonPfs[0].count;
					  		newSeason.pfs_gm = seasonPfsGm[0].count;
					  		newSeason.core = seasonCore[0].count;
					  		newSeason.core_gm = seasonCoreGm[0].count;
					  		
					  		progression.push(newSeason);	
				  		}
				  		
				  		person.progression = progression;

				  		// Add modules
				  		var modulesPfs = yield models.sequelize.query("SELECT COUNT(`reports`.`id`) as `count` FROM `reports` INNER JOIN `scenarios` ON `reports`.`scenario_id` = `scenarios`.`id` WHERE `reports`.`reporttype_id` = 1 AND `reports`.`person_id` = " + person.id + " AND `scenarios`.`archived_on` IS NULL AND `scenarios`.`type` = 'mod' AND `scenarios`.`game_id` = 1", {type: models.sequelize.QueryTypes.SELECT});
				  		var modulesPfsGm = yield models.sequelize.query("SELECT COUNT(`reports`.`id`) as `count` FROM `reports` INNER JOIN `scenarios` ON `reports`.`scenario_id` = `scenarios`.`id` WHERE `reports`.`reporttype_id` = 2 AND `reports`.`person_id` = " + person.id + " AND `scenarios`.`archived_on` IS NULL AND `scenarios`.`type` = 'mod' AND `scenarios`.`game_id` = 1", {type: models.sequelize.QueryTypes.SELECT});
				  		var modulesCore = yield models.sequelize.query("SELECT COUNT(`reports`.`id`) as `count` FROM `reports` INNER JOIN `scenarios` ON `reports`.`scenario_id` = `scenarios`.`id` WHERE `reports`.`reporttype_id` = 3 AND `reports`.`person_id` = " + person.id + " AND `scenarios`.`archived_on` IS NULL AND `scenarios`.`type` = 'mod' AND `scenarios`.`game_id` = 1", {type: models.sequelize.QueryTypes.SELECT});
				  		var modulesCoreGm = yield models.sequelize.query("SELECT COUNT(`reports`.`id`) as `count` FROM `reports` INNER JOIN `scenarios` ON `reports`.`scenario_id` = `scenarios`.`id` WHERE `reports`.`reporttype_id` = 4 AND `reports`.`person_id` = " + person.id + " AND `scenarios`.`archived_on` IS NULL AND `scenarios`.`type` = 'mod' AND `scenarios`.`game_id` = 1", {type: models.sequelize.QueryTypes.SELECT});
				  		
			  			var modules = {};
			  			modules.name = 'Modules';
			  			modules.total = yield models.Scenario.count({where: {type: 'mod', game_id: 1}});
			  			modules.pfs = modulesPfs[0].count;
			  			modules.pfs_gm = modulesPfsGm[0].count;
			  			modules.core = modulesCore[0].count;
			  			modules.core_gm = modulesCoreGm[0].count;
				  		
				  		progression.push(modules);	
				  		
				  		// Add adventure paths
				  		var apsPfs = yield models.sequelize.query("SELECT COUNT(`reports`.`id`) as `count` FROM `reports` INNER JOIN `scenarios` ON `reports`.`scenario_id` = `scenarios`.`id` WHERE `reports`.`reporttype_id` = 1 AND `reports`.`person_id` = " + person.id + " AND `scenarios`.`archived_on` IS NULL AND `scenarios`.`type` = 'ap' AND `scenarios`.`game_id` = 1", {type: models.sequelize.QueryTypes.SELECT});
				  		var apsPfsGm = yield models.sequelize.query("SELECT COUNT(`reports`.`id`) as `count` FROM `reports` INNER JOIN `scenarios` ON `reports`.`scenario_id` = `scenarios`.`id` WHERE `reports`.`reporttype_id` = 2 AND `reports`.`person_id` = " + person.id + " AND `scenarios`.`archived_on` IS NULL AND `scenarios`.`type` = 'ap' AND `scenarios`.`game_id` = 1", {type: models.sequelize.QueryTypes.SELECT});
				  		var apsCore = yield models.sequelize.query("SELECT COUNT(`reports`.`id`) as `count` FROM `reports` INNER JOIN `scenarios` ON `reports`.`scenario_id` = `scenarios`.`id` WHERE `reports`.`reporttype_id` = 3 AND `reports`.`person_id` = " + person.id + " AND `scenarios`.`archived_on` IS NULL AND `scenarios`.`type` = 'apt' AND `scenarios`.`game_id` = 1", {type: models.sequelize.QueryTypes.SELECT});
				  		var apsCoreGm = yield models.sequelize.query("SELECT COUNT(`reports`.`id`) as `count` FROM `reports` INNER JOIN `scenarios` ON `reports`.`scenario_id` = `scenarios`.`id` WHERE `reports`.`reporttype_id` = 4 AND `reports`.`person_id` = " + person.id + " AND `scenarios`.`archived_on` IS NULL AND `scenarios`.`type` = 'ap' AND `scenarios`.`game_id` = 1", {type: models.sequelize.QueryTypes.SELECT});
				  		
			  			var aps = {};
			  			aps.name = 'APs';
			  			aps.total = yield models.Scenario.count({where: {type: 'ap', game_id: 1}});
			  			aps.pfs = apsPfs[0].count;
			  			aps.pfs_gm = apsPfsGm[0].count;
			  			aps.core = apsCore[0].count;
			  			aps.core_gm = apsCoreGm[0].count;
				  		
				  		progression.push(aps);
				  		
				  		// Add other
				  		var otherPfs = yield models.sequelize.query("SELECT COUNT(`reports`.`id`) as `count` FROM `reports` INNER JOIN `scenarios` ON `reports`.`scenario_id` = `scenarios`.`id` WHERE `reports`.`reporttype_id` = 1 AND `reports`.`person_id` = " + person.id + " AND `scenarios`.`archived_on` IS NULL AND `scenarios`.`type` = 'other' AND `scenarios`.`game_id` = 1", {type: models.sequelize.QueryTypes.SELECT});
				  		var otherPfsGm = yield models.sequelize.query("SELECT COUNT(`reports`.`id`) as `count` FROM `reports` INNER JOIN `scenarios` ON `reports`.`scenario_id` = `scenarios`.`id` WHERE `reports`.`reporttype_id` = 2 AND `reports`.`person_id` = " + person.id + " AND `scenarios`.`archived_on` IS NULL AND `scenarios`.`type` = 'other' AND `scenarios`.`game_id` = 1", {type: models.sequelize.QueryTypes.SELECT});
				  		var otherCore = yield models.sequelize.query("SELECT COUNT(`reports`.`id`) as `count` FROM `reports` INNER JOIN `scenarios` ON `reports`.`scenario_id` = `scenarios`.`id` WHERE `reports`.`reporttype_id` = 3 AND `reports`.`person_id` = " + person.id + " AND `scenarios`.`archived_on` IS NULL AND `scenarios`.`type` = 'other' AND `scenarios`.`game_id` = 1", {type: models.sequelize.QueryTypes.SELECT});
				  		var otherCoreGm = yield models.sequelize.query("SELECT COUNT(`reports`.`id`) as `count` FROM `reports` INNER JOIN `scenarios` ON `reports`.`scenario_id` = `scenarios`.`id` WHERE `reports`.`reporttype_id` = 4 AND `reports`.`person_id` = " + person.id + " AND `scenarios`.`archived_on` IS NULL AND `scenarios`.`type` = 'other' AND `scenarios`.`game_id` = 1", {type: models.sequelize.QueryTypes.SELECT});
				  		
			  			var other = {};
			  			other.name = 'Other';
			  			other.total = yield models.Scenario.count({where: {type: 'other', game_id: 1}});
			  			other.pfs = otherPfs[0].count;
			  			other.pfs_gm = otherPfsGm[0].count;
			  			other.core = otherCore[0].count;
			  			other.core_gm = otherCoreGm[0].count;
				  		
				  		progression.push(other);
				  		
				  		// Deal with Starfinder Society (sfs)
				  		var progression_sfs = [];
				  		
				  		var seasons = 1;
				  		for(var i = 1; i < seasons+1; i++) {
				  			var seasonTotal = yield models.Scenario.count({where: {season: i, archived_on: null, type: 'scenario', game_id: 1}});
				  			var seasonSfs = yield models.sequelize.query("SELECT COUNT(`reports`.`id`) as `count` FROM `reports` INNER JOIN `scenarios` ON `reports`.`scenario_id` = `scenarios`.`id` WHERE `reports`.`reporttype_id` = 1 AND `reports`.`person_id` = " + person.id + " AND `scenarios`.`archived_on` IS NULL AND `scenarios`.`type` = 'scenario' AND `scenarios`.`game_id` = 3 AND `scenarios`.`season` = " + i, {type: models.sequelize.QueryTypes.SELECT});
				  			var seasonSfsGm = yield models.sequelize.query("SELECT COUNT(`reports`.`id`) as `count` FROM `reports` INNER JOIN `scenarios` ON `reports`.`scenario_id` = `scenarios`.`id` WHERE `reports`.`reporttype_id` = 2 AND `reports`.`person_id` = " + person.id + " AND `scenarios`.`archived_on` IS NULL AND `scenarios`.`type` = 'scenario' AND `scenarios`.`game_id` = 3 AND `scenarios`.`season` = " + i, {type: models.sequelize.QueryTypes.SELECT});
				  			
				  			var newSeason = {};
					  		newSeason.name = 'Season ' + i;
					  		newSeason.total = seasonTotal;
					  		newSeason.sfs = seasonSfs[0].count;
					  		newSeason.sfs_gm = seasonSfsGm[0].count;
					  		
					  		progression_sfs.push(newSeason);	
				  		}
				  		
				  		// Add modules
				  		var modulesSfs = yield models.sequelize.query("SELECT COUNT(`reports`.`id`) as `count` FROM `reports` INNER JOIN `scenarios` ON `reports`.`scenario_id` = `scenarios`.`id` WHERE `reports`.`reporttype_id` = 1 AND `reports`.`person_id` = " + person.id + " AND `scenarios`.`archived_on` IS NULL AND `scenarios`.`type` = 'mod' AND `scenarios`.`game_id` = 3", {type: models.sequelize.QueryTypes.SELECT});
				  		var modulesSfsGm = yield models.sequelize.query("SELECT COUNT(`reports`.`id`) as `count` FROM `reports` INNER JOIN `scenarios` ON `reports`.`scenario_id` = `scenarios`.`id` WHERE `reports`.`reporttype_id` = 2 AND `reports`.`person_id` = " + person.id + " AND `scenarios`.`archived_on` IS NULL AND `scenarios`.`type` = 'mod' AND `scenarios`.`game_id` = 3", {type: models.sequelize.QueryTypes.SELECT});
				  		
			  			var modules = {};
			  			modules.name = 'Modules';
			  			modules.total = yield models.Scenario.count({where: {type: 'mod', game_id: 3}});
			  			modules.sfs = modulesSfs[0].count;
			  			modules.sfs_gm = modulesSfsGm[0].count;
				  		
				  		progression_sfs.push(modules);	
				  		
				  		// Add adventure paths
				  		var apsSfs = yield models.sequelize.query("SELECT COUNT(`reports`.`id`) as `count` FROM `reports` INNER JOIN `scenarios` ON `reports`.`scenario_id` = `scenarios`.`id` WHERE `reports`.`reporttype_id` = 1 AND `reports`.`person_id` = " + person.id + " AND `scenarios`.`archived_on` IS NULL AND `scenarios`.`type` = 'ap' AND `scenarios`.`game_id` = 3", {type: models.sequelize.QueryTypes.SELECT});
				  		var apsSfsGm = yield models.sequelize.query("SELECT COUNT(`reports`.`id`) as `count` FROM `reports` INNER JOIN `scenarios` ON `reports`.`scenario_id` = `scenarios`.`id` WHERE `reports`.`reporttype_id` = 2 AND `reports`.`person_id` = " + person.id + " AND `scenarios`.`archived_on` IS NULL AND `scenarios`.`type` = 'ap' AND `scenarios`.`game_id` = 3", {type: models.sequelize.QueryTypes.SELECT});
				  		
			  			var aps = {};
			  			aps.name = 'APs';
			  			aps.total = yield models.Scenario.count({where: {type: 'ap', game_id: 3}});
			  			aps.sfs = apsSfs[0].count;
			  			aps.sfs_gm = apsSfsGm[0].count;
				  		
				  		progression_sfs.push(aps);	
				  		
				  		// Add other
				  		var otherSfs = yield models.sequelize.query("SELECT COUNT(`reports`.`id`) as `count` FROM `reports` INNER JOIN `scenarios` ON `reports`.`scenario_id` = `scenarios`.`id` WHERE `reports`.`reporttype_id` = 1 AND `reports`.`person_id` = " + person.id + " AND `scenarios`.`archived_on` IS NULL AND `scenarios`.`type` = 'other' AND `scenarios`.`game_id` = 3", {type: models.sequelize.QueryTypes.SELECT});
				  		var otherSfsGm = yield models.sequelize.query("SELECT COUNT(`reports`.`id`) as `count` FROM `reports` INNER JOIN `scenarios` ON `reports`.`scenario_id` = `scenarios`.`id` WHERE `reports`.`reporttype_id` = 2 AND `reports`.`person_id` = " + person.id + " AND `scenarios`.`archived_on` IS NULL AND `scenarios`.`type` = 'other' AND `scenarios`.`game_id` = 3", {type: models.sequelize.QueryTypes.SELECT});
				  		
			  			var other = {};
			  			other.name = 'Other';
			  			other.total = yield models.Scenario.count({where: {type: 'other', game_id: 3}});
			  			other.sfs = otherSfs[0].count;
			  			other.sfs_gm = otherSfsGm[0].count;
				  		
				  		progression_sfs.push(other);
				  		
				  		person.progression_sfs = progression_sfs;
				  		
				  		res.status(200).send(person);
				  	}
				  	else
				  	{
				  		res.status(404).send('NotFoundError');
				  	}
				} catch (errors) {
					winston.log('error', errors);
					res.status(500).send(errors);
				}
			});
		}).catch(function(error) {
			winston.log('error', error);
			res.status(400).send(error);
		});
	} else {
		res.status(400).send();
	}
});

/**
 * @api {get} /people/:personId/progress/:type GET person played progress
 * @apiName GetPersonProgress
 * @apiGroup People
 * 
 * @apiParam {Number} personId Person's unique ID.
 * @apiParam {String="pfs","pfs_gm","core","core_gm"} type Type of the progress.
 */

/**
 * [0] = {season: '0', total: 19, completed: 2, contenttype: 'scenario'}
 */
router.get('/:personId/progress', function(req, res, next) {
	models.Person.findById(req.params.personId, {
		include: [ { 
			model: models.Scenario, 
			as: 'scenarios',
			through: {
				where: {[req.params.type]: {$not: null}}
			}
		} ]
	}).then(function(person) {
	  	if(person !== null)
	  	{	
	  		res.status(200).send(person);
	  	}
	  	else
	  	{
	  		res.status(404).send('NotFoundError');
	  	}	  	
	}).catch(function(error) {
		winston.log('error', error);
		res.status(400).send(error);
	});
});

/**
 * @api {post} /people/ CREATE a person
 * @apiName CreatePerson
 * @apiGroup People
 * 
 * @apiParam {String} name Person's name.
 */
router.post('/', function(req, res, next){
	if(typeof req.body.name != 'undefined' && 
			typeof req.body.email != 'undefined' &&
			typeof req.body.pfsnumber != 'undefined' &&
			typeof req.body.password != 'undefined')
	{
		
	//TODO: Check email, check pfsnumber
		
		// Setup password
		var password = req.body.password;
		var salt = bcrypt.genSaltSync(10);
        var password_hash = bcrypt.hashSync(password.replace(/\s/g, ''), salt);
		
		models.Person.create({
			name: req.body.name,
			email: req.body.email,
			pfsnumber: req.body.pfsnumber,
			password: password_hash,
			ip_address: req.ip
		}).then(function(person) {
			res.set('Location', req.get('host') + '/api/people/' + person.id);
			res.status(201).send('created');
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
 * @api {put} /people/:personId UPDATE a person
 * @apiName UpdatePerson
 * @apiGroup People
 * 
 * @apiParam {Number} personId Person's unique ID.
 */
router.put('/:personId', function(req, res, next) {
	models.Person.findById(req.params.personId).then(function (person) {
	  	if(person !== null)
	  	{
			person.name = req.body.name;
			
			person.save(['name'])
			.then(function(p) {
				res.status(200).end();
			})
			.catch(function(error) {
				winston.log('error', error);
				res.status(500).end();
			});
	  	}
	  	else
	  	{
	  		res.status(404).send('NotFound');
	  	}	  	
	});
});

/**
 * @api {delete} /people/:personId DELETE a person
 * @apiName DeletePerson
 * @apiGroup People
 * 
 * @apiParam {Number} personId Person's unique ID.
 */
router.delete('/:personId', function(req, res, next) {
	models.Person.findById(req.params.personId).then(function(person) {
		if (person !== null) {
			person.destroy();
			res.status(200).end();
		} else {
			winston.log('error', error);
			res.status(404).end();
		}
	}).catch(function(error) {
		res.status(400).send(error);
	});
});

/**
 * @api {get} /user/pfsnumbercheck
 * @apiName PFSNumberCheck
 * @apiGroup People
 */
router.get('/pfsnumbercheck/:pfsNumber', function(req, res, next) {
	models.Person.find({
			attributes: ['id'],
			where: {pfsnumber: req.params.pfsNumber}
	}).then(function(person) {
		if(!person) {
			res.status(200).send('available');	
		} else {
			res.status(200).send('unavailable');
		}
	}).catch(function(err) {
		winston.log('error', err);
		res.status(400).send(err);
	});
});

/**
 * @api {post} /user/forgotpassword
 * @apiName ForgotPassword
 * @apiGroup People
 */
router.post('/forgotpassword', function(req, res, next) {
	if(typeof req.body.email != 'undefined') {
		models.Person.find({
			where: {email: req.body.email}
		}).then(function(person) {
			// Generate password recovery token
			var token = require('crypto').randomBytes(32).toString('hex');
			
			// Save the token to the database
			person.forgotten_password_code = token;
			person.forgotten_password_time = Math.round(new Date().getTime()/1000);
			person.save();
			
			/**
			 * Handle the emailing of the recovery link
			 */
			var nodemailer = require('nodemailer');
			
			// Configure SMTP
			var smtpConfig = {
				    host: 'localhost',
				    port: 25,
				    secure: false,
				    tls: {
				        rejectUnauthorized: false
				    }		    
				};
			
			var transporter = nodemailer.createTransport(smtpConfig);
			
			// Set email text
			var mailData = {
				    from: '"PFS Tracker" <no-reply@pfstracker.net>',
				    to: person.email,
				    subject: 'PFS Tracker Password Recovery',
				    text: 'PFS Tracker Password Recovery\n\nSomeone has requested password recovery for your account at https://www.pfstracker.net. If this was not you, you can ignore this email.\n\n' +
				    'If you do want to reset your password follow the following link to set a new password: https://www.pfstracker.net/#/passwordreset?resetcode=' + token,
				    html: '<body>' +
				    	'<h2>PFS Tracker Password Recovery</h2>' +
				    	'<p>Someone has requested password recovery for your account at <a href="https://www.pfstracker.net">PFS Tracker</a>. If this was not you, you can ignore this email.</p>' +
				    	'<p>If you do want to reset your password follow the following link to set a new password: <a href="https://www.pfstracker.net/#/passwordreset?resetcode=' + token + '">Password reset link</a></p>' +
				    	'</body>'
				};
			
			// Send mail
			transporter.sendMail(mailData, function(error, info){
			    if(error){
			    	winston.log('error', error);
			        res.status(500).send('Internal error while mailing password recovery');
			    } else {
			    	winston.log('Message sent: ' + info.response);
			    	res.status(200).send();
			    }
			});
		}).catch(function(err) {
			// Person does not exist under that email address
			// Do not inform the user and pretend everythign went fine
			winston.log('error', err);
			res.status(200).send();
		});
	} else {
		res.status(400).send();
	}
});

/**
 * @api {post} /user/resetpassword
 * @apiName ResetPassword
 * @apiGroup People
 */
router.post('/resetpassword', function(req, res, next) {
	if(typeof req.body.password != 'undefined' || typeof req.body.resetcode != 'undefined') {
		models.Person.find({
			where: {forgotten_password_code: req.body.resetcode}
		}).then(function(person) {
			// Set new password
			var new_password = req.body.password;
			var salt = bcrypt.genSaltSync(10);
            var new_password_hash = bcrypt.hashSync(new_password.replace(/\s/g, ''), salt);
            person.password = new_password_hash;
            
			// Remove the forgotten code and time
			person.forgotten_password_code = null;
			person.forgotten_password_time = null;
			
			// Save the person
			person.save();
			
			res.status(200).send();
		}).catch(function(err) {
			winston.log('error', err);
			res.status(500).send();
		});
	} else {
		res.status(400).send();
	}
});

/**
 * @api {get} /people/:pfsNumber/download GET a person's profile as a file to download
 * @apiName GetPersonDownload
 * @apiGroup People
 * 
 * @apiParam {Number} pfsNumber Person's unique PFSnumber.
 */
router.get('/:pfsNumber/download', function(req, res, next) {
	if(typeof parseInt(req.params.pfsNumber) == 'number') {
		models.Person.find({
			attributes: ['id', 'name', 'pfsnumber', 'country', 'public', 'public_characters'],
			where: {pfsnumber: req.params.pfsNumber}
		}).then(function(person) {
			co(function *() {
				try {
					// Add public characters value
				  	if(person !== null)
				  	{	
				  		if(person.public_characters) {
					  		// Get Characters
					  		var characters = yield models.Character.findAll({
								attributes: ['id', 'name', 'number', 'level', 'faction', 'class', 'campaign', 'exp'],
								where: {player_id: person.id},
								order: [ ['number', 'ASC'] ]
							});
					  		
					  		person.characters = characters;
				  		}
				  		
				  		var scenarios = yield models.Scenario.findAll({
				  			include: [{
				  				model: models.Person,
				  				attributes: ['id'],
				  				as: 'players',
					  			where: {id: person.id},
					  			required: false
				  			}],
				  			order: [ ['game', 'ASC'], ['type', 'ASC'], ['season', 'ASC'], ['number', 'ASC'], ['name', 'ASC'] ]
				  		});
				  		
				  		// Create excel
				  		var xl = require('excel4node');
				  		
				  		// Create new spreadsheet
				  		var wb = new xl.Workbook();
				  		
				  		// Played history worksheet
				  		var ws_played = wb.addWorksheet('Played history');
				  		
				  		// Set column headers
				  		ws_played.column(1).setWidth(8);
				  		ws_played.cell(1,1).string("Game");
				  		ws_played.column(2).setWidth(10);
				  		ws_played.cell(1,2).string("Type");
				  		ws_played.column(3).setWidth(9);
				  		ws_played.cell(1,3).string("Season");
				  		ws_played.column(4).setWidth(5);
				  		ws_played.cell(1,4).string("#");
				  		ws_played.column(5).setWidth(50);
				  		ws_played.cell(1,5).string("Name");
				  		ws_played.column(6).setWidth(9);
				  		ws_played.cell(1,6).string("Tier");
				  		ws_played.column(7).setWidth(12);
				  		ws_played.cell(1,7).string("PC");
				  		ws_played.column(8).setWidth(12);
				  		ws_played.cell(1,8).string("GM");
				  		ws_played.column(9).setWidth(12);
				  		ws_played.cell(1,9).string("PC (CORE)");
				  		ws_played.column(10).setWidth(12);
				  		ws_played.cell(1,10).string("GM (CORE)");
				  		ws_played.column(11).setWidth(11);
				  		ws_played.cell(1,11).string("Evergreen");
				  		ws_played.column(12).setWidth(8);
				  		ws_played.cell(1,12).string("Quest");
				  		ws_played.column(13).setWidth(12);
				  		ws_played.cell(1,13).string("Multitable");
				  		ws_played.column(14).setWidth(12);
				  		ws_played.cell(1,14).string("Archived");
				  		
				  		ws_played.row(1).filter();
				  		
				  		var row_count = 2;
				  		scenarios.forEach((content) => {
				  			// 1: Game
				  			ws_played.cell(row_count, 1).string(content.game);
				  			
				  			// 2: Type
				  			ws_played.cell(row_count, 2).string(content.type);
				  			
				  			// 3: Season
				  			ws_played.cell(row_count, 3).string(content.season);
				  			
				  			// 4: Number
				  			if(content.number !== null) {
				  				ws_played.cell(row_count, 4).string(content.number);
				  			}
				  			
				  			// 5: Name
				  			ws_played.cell(row_count, 5).string(content.name);
				  			
				  			// 6: Tier
				  			if(content.number !== null) {
				  				ws_played.cell(row_count, 6).string(content.tier);
				  			}
				  			
				  			// Set the following four fields only if the player has played any of it
				  			if(content.players.length > 0) {
				  				if(content.game == 'pfs') {
					  				// Handle PFS game
					  				// 7: PC
				  					if(content.players[0].j_scenario_person.pfs !== null) {
				  						ws_played.cell(row_count, 7).date(content.players[0].j_scenario_person.pfs);
				  					}
				  					
						  			// 8: GM
				  					if(content.players[0].j_scenario_person.pfs_gm !== null) {
				  						ws_played.cell(row_count, 8).date(content.players[0].j_scenario_person.pfs_gm);
				  					}
				  					
				  					// 9: PC (CORE)
				  					if(content.players[0].j_scenario_person.core !== null) {
				  						ws_played.cell(row_count, 9).date(content.players[0].j_scenario_person.core);
				  					}
				  					
						  			// 10: GM (CORE)
				  					if(content.players[0].j_scenario_person.core_gm !== null) {
				  						ws_played.cell(row_count, 10).date(content.players[0].j_scenario_person.core_gm);
				  					}
				  				} else if(content.game == 'sfs') {
					  				// Handle SFS game
					  				// 7: PC
				  					if(content.players[0].j_scenario_person.sfs !== null) {
				  						ws_played.cell(row_count, 7).date(content.players[0].j_scenario_person.sfs);
				  					}
				  					
						  			// 8: GM
				  					if(content.players[0].j_scenario_person.sfs_gm !== null) {
				  						ws_played.cell(row_count, 8).date(content.players[0].j_scenario_person.sfs_gm);
				  					}
				  					
				  					// 9: PC (CORE)
				  					ws_played.cell(row_count, 9).string('N/A')
				  					
				  					// 10: GM (CORE)
				  					ws_played.cell(row_count, 10).string('N/A')
				  				}	  				
				  			} else {
				  				if(content.game == 'sfs') {
				  					// 9: PC (CORE)
				  					ws_played.cell(row_count, 9).string('N/A')
				  					
				  					// 10: GM (CORE)
				  					ws_played.cell(row_count, 10).string('N/A')
				  				}
				  			}
				  			
				  			// 11: Evergreen
				  			if(content.evergreen == 1) {
				  				ws_played.cell(row_count, 11).string('yes');
				  			} else {
				  				ws_played.cell(row_count, 11).string('no');
				  			}
				  			
				  			// 12: Quest
				  			if(content.quest == 1) {
				  				ws_played.cell(row_count, 12).string('yes');
				  			} else {
				  				ws_played.cell(row_count, 12).string('no');
				  			}
				  			
				  			// 13: Multitable
				  			if(content.multitable == 1) {
				  				ws_played.cell(row_count, 13).string('yes');
				  			} else {
				  				ws_played.cell(row_count, 13).string('no');
				  			}
				  			
				  			// 14: Archived
				  			if(content.archived_at !== null) {
				  				ws_played.cell(row_count, 14).date(content.archived_at);
				  			}
				  			
				  			row_count++;
				  		});
				  		
				  		// Characters worksheet (if public characters);
				  		if(person.public_characters) {
				  			var ws_characters = wb.addWorksheet('Characters');
				  		}
				  		
				  		wb.write('PFStracker history - ' + person.pfsnumber + '.xlsx', res);
				  	}
				  	else
				  	{
				  		res.status(404).send('NotFoundError');
				  	}
				} catch (errors) {
					winston.log('error', errors);
					res.status(500).send(errors);
				}
			});
		}).catch(function(error) {
			winston.log('error', error);
			res.status(400).send(error);
		});
	} else {
		res.status(400).send();
	}
});

module.exports = router;
