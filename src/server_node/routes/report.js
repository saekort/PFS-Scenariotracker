var express = require('express');
var path = require('path'); // Handling and transforming file paths
var models = require("../models");
var env       = process.env.NODE_ENV || 'development'; // Environment
var config    = require(path.join(__dirname, '..', 'config', 'pfstracker.json'))[env];
var passport  = require('../middlewares/passportProvider');
var expressJwt = require('express-jwt');  
var authenticate = expressJwt({secret : config.apiSecret, credentialsRequired: false });
var router = express.Router();
var winston = require('winston');

router.post('/', authenticate, function(req, res, next) {
	var stateOptions = ['pfs', 'pfs_gm', 'core', 'core_gm'];
	if(typeof req.body.pfsNumber !== 'undefined' 
		&& typeof req.body.content !== 'undefined' 
		&& typeof req.body.state !== 'undefined' 
		&& stateOptions.indexOf(req.body.state) > -1) {
		
		models.Person.find({where: {pfsnumber: req.body.pfsNumber}}).then(function(person) {
			if(person.public || (typeof req.user !== 'undefined' && person.pfsnumber === req.user.pfsnumber)) {
				models.j_scenario_person.find({
					where: {scenario_id: req.body.content, person_id: person.id}
				}).then(function(played) {
					if(played) {
						// Update association
						played.update(req.body.state, new Date())
						.then(function(played) {
							res.status(200).send();	
						});
					} else {
						// Create association
						models.Scenario.findById(req.body.content)
						.then(function(scenario) {
							person.addScenario(scenario).then(function() {
								models.j_scenario_person.find({
									where: {scenario_id: req.body.content, person_id: person.id}
								}).then(function(playedNew) {
									playedNew.update(req.body.state, new Date());
									res.status(200).send(playedNew);	
								});	
							});
						});
					}				
				}).catch(function(err) {
					winston.log('error', err);
					res.status(500).send();
				});
			} else {
				winston.log('error', req.user);
				res.status(403).send();
			}
		});
	} else {
		res.status(400).send();
	}
});

router.delete('/', authenticate, function(req, res, next) {
	var stateOptions = ['pfs', 'pfs_gm', 'core', 'core_gm'];
	
	if(typeof req.body.pfsNumber !== 'undefined' 
		&& typeof req.body.content !== 'undefined' 
		&& typeof req.body.state !== 'undefined' 
		&& stateOptions.indexOf(req.body.state) > -1) {
		
		models.Person.find({where: {pfsnumber: req.body.pfsNumber}}).then(function(person) {
			if(person.public || (typeof req.user !== 'undefined' && person.pfsnumber === req.user.pfsnumber)) {
				models.j_scenario_person.find({
					where: {scenario_id: req.body.content, person_id: person.id}
				}).then(function(played) {
					played.update({[req.body.state]: null})
					.then(function(played) {
						res.status(200).send();	
					});
				});
			} else {
				res.status(403).send();
			}
		});
	} else {
		res.status(400).send();
	}
});

router.post('/import', authenticate, function(req, res, next) {
	var stateOptions = ['pfs', 'pfs_gm', 'core', 'core_gm'];
	var content = req.body;
	if(typeof content.pfsnumber !== 'undefined') {
		models.Person.find({where: {pfsnumber: content.pfsnumber}}).then(function(person) {
			if(person.public || (typeof req.user !== 'undefined' && person.pfsnumber === req.user.pfsnumber)) {
				//TODO: Actually do something with the data
				res.status(200).send('Import succesfull');
			} else {
				res.status(403).send('UNAUTHORIZED');
			}
		}).catch(function(err) {
			winston.log('error', err);
			res.status(400).send('PERSON NOT FOUND');
		});
	} else {
		res.status(400).send('ERROR');
	}
});

module.exports = router;