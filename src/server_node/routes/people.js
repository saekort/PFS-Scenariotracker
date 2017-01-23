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
				  		totals.pfs = yield models.j_scenario_person.count({
				  			where: {person_id: person.id, pfs: {$not: null}},
				  			include: [{
				  			    model: models.Scenario, 
				  			    as: 'scenario',
			  			  		where: {archived_at: null}
				  			}]
				  		});
				  		totals.pfs_gm = yield models.j_scenario_person.count({
				  			where: {person_id: person.id, pfs_gm: {$not: null}},
						  	include: [{
						  	    model: models.Scenario, 
						  	    as: 'scenario',
					  			where: {archived_at: null}
						  	}]
				  		});
				  		totals.core = yield models.j_scenario_person.count({
				  			where: {person_id: person.id, core: {$not: null}},
						  	include: [{
						  	    model: models.Scenario, 
						  	    as: 'scenario',
					  			where: {archived_at: null}
						  	}]
				  		});
				  		totals.core_gm = yield models.j_scenario_person.count({
				  			where: {person_id: person.id, core_gm: {$not: null}},
						  	include: [{
						  	    model: models.Scenario, 
						  	    as: 'scenario',
					  			where: {archived_at: null}
						  	}]
				  		});
				  		
				  		person.totals = totals;
				  		
				  		var progression = [];
				  		
				  		// Add all season progression
				  		var seasons = 8;
				  		for(var i = 0; i < seasons+1; i++) {
				  			var seasonTotal = yield models.Scenario.count({where: {season: i, archived_at: null, type: 'scenario'}});
				  			var seasonPfs = yield models.sequelize.query("SELECT COUNT(`j_scenario_person`.`id`) as `count` FROM `j_scenario_person` INNER JOIN `scenarios` ON `j_scenario_person`.`scenario_id` = `scenarios`.`id` WHERE `j_scenario_person`.`pfs` IS NOT NULL AND `j_scenario_person`.`person_id` = " + person.id + " AND `scenarios`.`archived_at` IS NULL AND `scenarios`.`type` = 'scenario' AND `scenarios`.`season` = " + i, {type: models.sequelize.QueryTypes.SELECT});
				  			var seasonPfsGm = yield models.sequelize.query("SELECT COUNT(`j_scenario_person`.`id`) as `count` FROM `j_scenario_person` INNER JOIN `scenarios` ON `j_scenario_person`.`scenario_id` = `scenarios`.`id` WHERE `j_scenario_person`.`pfs_gm` IS NOT NULL AND `j_scenario_person`.`person_id` = " + person.id + " AND `scenarios`.`archived_at` IS NULL AND `scenarios`.`type` = 'scenario' AND  `scenarios`.`season` = " + i, {type: models.sequelize.QueryTypes.SELECT});
				  			var seasonCore = yield models.sequelize.query("SELECT COUNT(`j_scenario_person`.`id`) as `count` FROM `j_scenario_person` INNER JOIN `scenarios` ON `j_scenario_person`.`scenario_id` = `scenarios`.`id` WHERE `j_scenario_person`.`core` IS NOT NULL AND `j_scenario_person`.`person_id` = " + person.id + " AND `scenarios`.`archived_at` IS NULL AND `scenarios`.`type` = 'scenario' AND  `scenarios`.`season` = " + i, {type: models.sequelize.QueryTypes.SELECT});
				  			var seasonCoreGm = yield models.sequelize.query("SELECT COUNT(`j_scenario_person`.`id`) as `count` FROM `j_scenario_person` INNER JOIN `scenarios` ON `j_scenario_person`.`scenario_id` = `scenarios`.`id` WHERE `j_scenario_person`.`core_gm` IS NOT NULL AND `j_scenario_person`.`person_id` = " + person.id + " AND `scenarios`.`archived_at` IS NULL AND `scenarios`.`type` = 'scenario' AND  `scenarios`.`season` = " + i, {type: models.sequelize.QueryTypes.SELECT});
				  			
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
				  		
				  		// Add quests
				  		var questsPfs = yield models.sequelize.query("SELECT COUNT(`j_scenario_person`.`id`) as `count` FROM `j_scenario_person` INNER JOIN `scenarios` ON `j_scenario_person`.`scenario_id` = `scenarios`.`id` WHERE `j_scenario_person`.`pfs` IS NOT NULL AND `j_scenario_person`.`person_id` = " + person.id + " AND `scenarios`.`archived_at` IS NULL AND `scenarios`.`type` = 'quest'", {type: models.sequelize.QueryTypes.SELECT});
				  		var questsPfsGm = yield models.sequelize.query("SELECT COUNT(`j_scenario_person`.`id`) as `count` FROM `j_scenario_person` INNER JOIN `scenarios` ON `j_scenario_person`.`scenario_id` = `scenarios`.`id` WHERE `j_scenario_person`.`pfs_gm` IS NOT NULL AND `j_scenario_person`.`person_id` = " + person.id + " AND `scenarios`.`archived_at` IS NULL AND `scenarios`.`type` = 'quest'", {type: models.sequelize.QueryTypes.SELECT});
				  		var questsCore = yield models.sequelize.query("SELECT COUNT(`j_scenario_person`.`id`) as `count` FROM `j_scenario_person` INNER JOIN `scenarios` ON `j_scenario_person`.`scenario_id` = `scenarios`.`id` WHERE `j_scenario_person`.`core` IS NOT NULL AND `j_scenario_person`.`person_id` = " + person.id + " AND `scenarios`.`archived_at` IS NULL AND `scenarios`.`type` = 'quest'", {type: models.sequelize.QueryTypes.SELECT});
				  		var questsCoreGm = yield models.sequelize.query("SELECT COUNT(`j_scenario_person`.`id`) as `count` FROM `j_scenario_person` INNER JOIN `scenarios` ON `j_scenario_person`.`scenario_id` = `scenarios`.`id` WHERE `j_scenario_person`.`core_gm` IS NOT NULL AND `j_scenario_person`.`person_id` = " + person.id + " AND `scenarios`.`archived_at` IS NULL AND `scenarios`.`type` = 'quest'", {type: models.sequelize.QueryTypes.SELECT});
				  		
			  			var quests = {};
				  		quests.name = 'Quests';
				  		quests.total = yield models.Scenario.count({where: {type: 'quest'}});
				  		quests.pfs = questsPfs[0].count;
				  		quests.pfs_gm = questsPfsGm[0].count;
				  		quests.core = questsCore[0].count;
				  		quests.core_gm = questsCoreGm[0].count;
				  		
				  		progression.push(quests);	
				  		
				  		// Add modules
				  		var modulesPfs = yield models.sequelize.query("SELECT COUNT(`j_scenario_person`.`id`) as `count` FROM `j_scenario_person` INNER JOIN `scenarios` ON `j_scenario_person`.`scenario_id` = `scenarios`.`id` WHERE `j_scenario_person`.`pfs` IS NOT NULL AND `j_scenario_person`.`person_id` = " + person.id + " AND `scenarios`.`archived_at` IS NULL AND `scenarios`.`type` = 'mod'", {type: models.sequelize.QueryTypes.SELECT});
				  		var modulesPfsGm = yield models.sequelize.query("SELECT COUNT(`j_scenario_person`.`id`) as `count` FROM `j_scenario_person` INNER JOIN `scenarios` ON `j_scenario_person`.`scenario_id` = `scenarios`.`id` WHERE `j_scenario_person`.`pfs_gm` IS NOT NULL AND `j_scenario_person`.`person_id` = " + person.id + " AND `scenarios`.`archived_at` IS NULL AND `scenarios`.`type` = 'mod'", {type: models.sequelize.QueryTypes.SELECT});
				  		var modulesCore = yield models.sequelize.query("SELECT COUNT(`j_scenario_person`.`id`) as `count` FROM `j_scenario_person` INNER JOIN `scenarios` ON `j_scenario_person`.`scenario_id` = `scenarios`.`id` WHERE `j_scenario_person`.`core` IS NOT NULL AND `j_scenario_person`.`person_id` = " + person.id + " AND `scenarios`.`archived_at` IS NULL AND `scenarios`.`type` = 'mod'", {type: models.sequelize.QueryTypes.SELECT});
				  		var modulesCoreGm = yield models.sequelize.query("SELECT COUNT(`j_scenario_person`.`id`) as `count` FROM `j_scenario_person` INNER JOIN `scenarios` ON `j_scenario_person`.`scenario_id` = `scenarios`.`id` WHERE `j_scenario_person`.`core_gm` IS NOT NULL AND `j_scenario_person`.`person_id` = " + person.id + " AND `scenarios`.`archived_at` IS NULL AND `scenarios`.`type` = 'mod'", {type: models.sequelize.QueryTypes.SELECT});
				  		
			  			var modules = {};
			  			modules.name = 'Modules';
			  			modules.total = yield models.Scenario.count({where: {type: 'mod'}});
			  			modules.pfs = modulesPfs[0].count;
			  			modules.pfs_gm = modulesPfsGm[0].count;
			  			modules.core = modulesCore[0].count;
			  			modules.core_gm = modulesCoreGm[0].count;
				  		
				  		progression.push(modules);	
				  		
				  		// Add adventure paths
				  		var apsPfs = yield models.sequelize.query("SELECT COUNT(`j_scenario_person`.`id`) as `count` FROM `j_scenario_person` INNER JOIN `scenarios` ON `j_scenario_person`.`scenario_id` = `scenarios`.`id` WHERE `j_scenario_person`.`pfs` IS NOT NULL AND `j_scenario_person`.`person_id` = " + person.id + " AND `scenarios`.`archived_at` IS NULL AND `scenarios`.`type` = 'ap'", {type: models.sequelize.QueryTypes.SELECT});
				  		var apsPfsGm = yield models.sequelize.query("SELECT COUNT(`j_scenario_person`.`id`) as `count` FROM `j_scenario_person` INNER JOIN `scenarios` ON `j_scenario_person`.`scenario_id` = `scenarios`.`id` WHERE `j_scenario_person`.`pfs_gm` IS NOT NULL AND `j_scenario_person`.`person_id` = " + person.id + " AND `scenarios`.`archived_at` IS NULL AND `scenarios`.`type` = 'ap'", {type: models.sequelize.QueryTypes.SELECT});
				  		var apsCore = yield models.sequelize.query("SELECT COUNT(`j_scenario_person`.`id`) as `count` FROM `j_scenario_person` INNER JOIN `scenarios` ON `j_scenario_person`.`scenario_id` = `scenarios`.`id` WHERE `j_scenario_person`.`core` IS NOT NULL AND `j_scenario_person`.`person_id` = " + person.id + " AND `scenarios`.`archived_at` IS NULL AND `scenarios`.`type` = 'apt'", {type: models.sequelize.QueryTypes.SELECT});
				  		var apsCoreGm = yield models.sequelize.query("SELECT COUNT(`j_scenario_person`.`id`) as `count` FROM `j_scenario_person` INNER JOIN `scenarios` ON `j_scenario_person`.`scenario_id` = `scenarios`.`id` WHERE `j_scenario_person`.`core_gm` IS NOT NULL AND `j_scenario_person`.`person_id` = " + person.id + " AND `scenarios`.`archived_at` IS NULL AND `scenarios`.`type` = 'ap'", {type: models.sequelize.QueryTypes.SELECT});
				  		
			  			var aps = {};
			  			aps.name = 'APs';
			  			aps.total = yield models.Scenario.count({where: {type: 'ap'}});
			  			aps.pfs = apsPfs[0].count;
			  			aps.pfs_gm = apsPfsGm[0].count;
			  			aps.core = apsCore[0].count;
			  			aps.core_gm = apsCoreGm[0].count;
				  		
				  		progression.push(aps);	
				  		
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
			    	console.log('Message sent: ' + info.response);
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

module.exports = router;
