var express = require('express');
var models = require("../models");
var router = express.Router();
var winston = require('winston');

/**
 * @api {get} /groups GET a set of groups
 * @apiName GetGroups
 * @apiGroup Groups
 * 
 * @apiParam {Number} rows Amount of Groups to return. Max 20.
 * @apiParam {Number} page Page of Groups to return.
 * @apiParam {Search} [search] String to limit results to. Searches on `name`.
 * 
 * @apiHeader {String} Authorization "Bearer " + [JSON Web Token (JWT)]
 */
router.get('/', function(req, res, next) {
	//TODO: Add limits for private groups
	if(req.query.rows && req.query.page && req.query.rows <= 20)
	{
		var search = '';
		if(typeof req.query.search != 'undefined') {
			search = req.query.search;
		}		
		
		models.Group.findAndCountAll({
			attributes: ['id', 'name'],
			where: models.sequelize.or({name: {$like: '%' + search + '%'}}),
			include: [
					    {model: models.Person, as: 'owner', attributes: ['pfsnumber', 'name']},
					    {
					    	model: models.Person, 
					    	as: 'members', 
					    	attributes: ['name', 'pfsnumber'],
					    	required: false,
							duplicating: false,
					    	through: {as: '', attributes: []}}
					],
			limit: parseInt(req.query.rows),
			offset: parseInt(req.query.page * req.query.rows - req.query.rows),
			duplicating: false,
			order: [ ['name', 'ASC'] ]
		}).then(function(groups) {
			res.status(200).send(groups);
		}).catch(function(error) {
			winston.log('error', error);
			res.status(400).send(error);
		});
	} else {
		res.status(400).end();
	}
});

/**
 * @api {get} /groups/:id GET a group
 * @apiName GetGroup
 * @apiGroup Group
 */
router.get('/:id', function(req, res, next) {
	if(req.params.id)
	{	
		models.Group.findById(req.params.id, {
			attributes: ['id', 'name', 'public'],
			include: [
			    {model: models.Person, as: 'owner', attributes: ['pfsnumber', 'name']},
			    {model: models.Person, as: 'admins', attributes: ['pfsnumber', 'name'], through: {as: '', attributes: []}},
			    {model: models.Person, as: 'members', attributes: ['pfsnumber', 'name'], through: {as: '', attributes: []}}
			],
		})
		.then(function(group) {
			res.status(200).send(group);
		}).catch(function(error) {
			winston.log('error', error);
			res.status(400).send(error);
		});
	} else {
		res.status(400).end();
	}
});

module.exports = router;