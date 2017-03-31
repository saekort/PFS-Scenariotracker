var express = require('express');
var models = require("../models")
var co  = require('co');;
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
	if(req.query.rows && req.query.page <= 20)
	{
		co(function *() {
			try {
				var search = '';
				if(typeof req.query.search != 'undefined') {
					search = req.query.search;
				}		
				
				var groups = yield models.Group.findAndCountAll({
					attributes: ['id', 'name'],
					include: [{model: models.Person, as: 'owner', attributes: ['pfsnumber', 'name']}],
					where: models.sequelize.or({name: {$like: '%' + search + '%'}}),
					limit: parseInt(req.query.rows),
					offset: parseInt(req.query.page * req.query.rows - req.query.rows),
					order: [ ['name', 'ASC'] ]
				});

				for(var i =0; i < groups.rows.length; i++) {
					groups.rows[i].dataValues.memberCount = yield models.j_group_person.count({where: {group_id: groups.rows[i].dataValues.id} });
				}				
				
				res.status(200).send(groups);
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
 * @api {get} /groups/:id GET a group
 * @apiName GetGroup
 * @apiGroup Group
 */
router.get('/:id', function(req, res, next) {
	if(req.params.id)
	{	
		models.Group.findById(req.params.id, {
			attributes: ['id', 'name'],
			include: [
			    //{model: models.Person, as: 'owner', attributes: ['pfsnumber', 'name']},
			    {
			    	model: models.Person, as: 'members', 
			    	attributes: ['pfsnumber', 'name'], 
			    	through: {as: '', attributes: []},
			    	required: false
			    }
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