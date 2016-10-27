var express = require('express');
var models = require("../models");
var router = express.Router();
var winston = require('winston');

/**
 * @api {get} /character GET a group of characters
 * @apiName GetCharacters
 * @apiGroup Character
 */

/**
 * @api {get} /characters/:id GET a character
 * @apiName GetCharacter
 * @apiGroup Character
 * 
 * @apiParam {Number} id Character's unique ID.
 */
router.get('/', function(req, res, next) {
	models.Characters.findAndCountAll()
	.then(function(characters) {
		res.status(200).send(characters);
	}).catch(function(error) {
		winston.log('error', error);
		res.status(400).send(error);
	});
});

/**
 * @api {post} /characters/ CREATE a character
 * @apiName CreateCharacter
 * @apiGroup Character
 */

/**
 * @api {put} /characters/:id UPDATE a character
 * @apiName UpdateCharacter
 * @apiGroup Character
 *
 * @apiParam {Number} id Character's unique ID.
 */

/**
 * @api {delete} /characters/:id DELETE a character
 * @apiName DeleteCharacter
 * @apiGroup Character
 *
 * @apiParam {Number} id Character's unique ID.
 */

module.exports = router;
