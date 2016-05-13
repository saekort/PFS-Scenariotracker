var express = require('express');
var models = require("../models");
var router = express.Router();

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
		
		models.People.findAndCountAll({
			where: models.sequelize.or({name: {$like: '%' + search + '%'}},{pfsnumber: {$like: '%' + search + '%'}}),
			limit: parseInt(req.query.rows),
			offset: parseInt(req.query.page * req.query.rows - req.query.rows),			
			order: '`name` ASC'
		}).then(function(people) {
			res.status(200).send(people);
		}).catch(function(error) {
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
	models.People.findById(req.params.personId)
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
			typeof req.body.pfsnumber != 'undefined') 
	{
		models.People.create({
			name: req.body.name,
			email: req.body.email,
			pfsnumber: req.body.pfsnumber,
			ip_address: req.ip
		}).then(function(person) {
			res.set('Location', req.get('host') + '/api/people/' + person.id);
			res.status(201).send('created');
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
 * @api {put} /people/:personId UPDATE a person
 * @apiName UpdatePerson
 * @apiGroup People
 * 
 * @apiParam {Number} personId Person's unique ID.
 */
router.put('/:personId', function(req, res, next) {
	models.People.findById(req.params.personId).then(function (person) {
	  	if(person !== null)
	  	{
			person.name = req.body.name;
			
			person.save(['name'])
			.then(function(p) {
				res.status(200).end();
			})
			.catch(function(error) {
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
	models.People.findById(req.params.personId).then(function(person) {
		if (person !== null) {
			person.destroy();
			res.status(200).end();
		} else {
			res.status(404).end();
		}
	}).catch(function(error) {
		res.status(400).send(error);
	});
});

module.exports = router;
