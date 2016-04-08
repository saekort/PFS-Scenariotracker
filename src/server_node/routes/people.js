var express = require('express');
var models = require("../models");
var router = express.Router();

/**
 * @api {get} /person GET a group of persons
 * @apiName GetPersons
 * @apiGroup Person
 * 
 * @apiHeader {String} Authorization "Bearer " + [JSON Web Token (JWT)]
 */

/**
 * @api {get} /person/:id GET a person
 * @apiName GetPerson
 * @apiGroup Person
 * 
 * @apiParam {Number} id Person's unique ID.
 */
router.get('/', function(req, res, next) {
	models.People.findAndCountAll()
	.then(function(people) {
		res.status(200).send(people);
	}).catch(function(error) {
		res.status(400).send(error);
	});
});

/**
 * @api {post} /person/ CREATE a person
 * @apiName CreatePerson
 * @apiGroup Person
 */

/**
 * @api {put} /person/:id UPDATE a person
 * @apiName UpdatePerson
 * @apiGroup Person
 */

/**
 * @api {delete} /person/:id DELETE a person
 * @apiName DeletePerson
 * @apiGroup Person
 */

module.exports = router;
