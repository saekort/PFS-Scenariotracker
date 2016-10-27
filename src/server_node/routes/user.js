var router = require('express').Router();
var path = require('path'); // Handling and transforming file paths
var models = require('../models');
var env       = process.env.NODE_ENV || 'development'; // Environment
var config    = require(path.join(__dirname, '..', 'config', 'pfstracker.json'))[env];
var passport  = require('../middlewares/passportProvider');
var expressJwt = require('express-jwt');  
var authenticate = expressJwt({secret : config.apiSecret});
var tokenizer = require('../helpers/tokenizer');
var bcrypt    = require('bcryptjs');
var winston = require('winston');

/**
 * @api {get} /user GET the user's data
 * @apiName GetUser
 * @apiGroup User
 * 
 * @apiHeader {String} Authorization "Bearer " + [JSON Web Token (JWT)]
 */
router.get('/', authenticate, function(req, res, next) {
	models.Person.findById(req.user.id)
	.then(function(person) {
		res.status(200).send(person);
	}).catch(function(err) {
		winston.log('error', err);
		res.status(400).send(err);
	});
});

/**
 * @api {put} /user PUT the user's data
 * @apiName PutUser
 * @apiGroup User
 * 
 * @apiHeader {String} Authorization "Bearer " + [JSON Web Token (JWT)]
 */
router.put('/', authenticate, function(req, res, next) {
	// Get the user
	models.Person.findById(req.user.id)
	.then(function(person) {
		if(typeof req.body.name !== 'undefined') { person.name = req.body.name; }
		if(typeof req.body.pfsnumber !== 'undefined') {	person.pfsnumber = req.body.pfsnumber; }
		if(typeof req.body.country !== 'undefined') { person.country = req.body.country; }
		if(typeof req.body.public !== 'undefined') { person.public = req.body.public; }
		if(typeof req.body.publiccharacters !== 'undefined') { person.public_characters = req.body.publiccharacters; }
		
		person.save()
		.then(function(person) {
			res.status(200).send(person);
		}).catch(Sequelize.ValidationError, function (err) {
			winston.log('error', err.errors);
			res.status(422).send(err.errors);
		}).catch(function(err) {
			winston.log('error', err);
			res.status(400).send(err);
		})
	}).catch(function(err) {
		//res.status(400).send(err);
	});
});

/**
 * @api {get} /user/pfsnumbercheck
 * @apiName PFSNumberCheck
 * @apiGroup User
 */
router.get('/pfsnumbercheck/:pfsNumber', authenticate, function(req, res, next) {
	models.Person.find({where: {pfsnumber: req.params.pfsNumber}})
	.then(function(person) {
		if(!person || person.id === req.user.id) {
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
 * @api {get} /user/characters GET the user's characters
 * @apiName GetUserCharacters
 * @apiGroup User
 * 
 * @apiHeader {String} Authorization "Bearer " + [JSON Web Token (JWT)]
 */
router.get('/characters', authenticate, function(req, res, next) {
	models.Character.findAll({where: {player_id: req.user.id}, order: [['number', 'ASC']]})
	.then(function(characters) {
		res.status(200).send(characters);
	}).catch(function(err) {
		winston.log('error', err);
		res.status(400).send(err);
	});
});

/**
 * @api {post} /user/characters
 * @apiName PostUserCharacter
 * @apiGroup User
 * 
 * @apiHeader {String} Authorization "Bearer " + [JSON Web Token (JWT)]
 */
router.post('/characters', authenticate, function(req, res, next) {
	if(typeof req.body.name !== 'undefined' && typeof req.body.campaign !== 'undefined') {
		var data = {name: req.body.name, campaign: req.body.campaign};
		data.player_id = req.user.id;
		
		if(typeof req.body.number !== 'undefined') { data.number = req.body.number; }
		if(typeof req.body.faction !== 'undefined') { data.faction = req.body.faction; }
		if(typeof req.body.class !== 'undefined') { data.class = req.body.class; }
		if(typeof req.body.level !== 'undefined') { data.level = req.body.level; }
		if(typeof req.body.exp !== 'undefined') { data.exp = req.body.exp; }
		
		models.Character.create(data)
		.then(function(character) {
			res.set('Location', req.get('host') + '/character/' + character.id);
			res.status(201).end();
		}).catch(function(err) {
			winston.log('error', err);
			res.status(500).send(err);
		});
	}
});

/**
 * @api {put} /user/characters
 * @apiName PutUserCharacter
 * @apiGroup User
 * 
 * @apiHeader {String} Authorization "Bearer " + [JSON Web Token (JWT)]
 */
router.put('/characters/:characterId', authenticate, function(req, res, next) {
	// Get the character
	models.Character.find({where: {player_id: req.user.id, id: req.params.characterId}})
	.then(function(character) {
		if(typeof req.body.name !== 'undefined') { character.name = req.body.name; }
		if(typeof req.body.campaign !== 'undefined') { character.number = req.body.campaign; }
		if(typeof req.body.number !== 'undefined') { character.number = req.body.number; }
		if(typeof req.body.faction !== 'undefined') { character.faction = req.body.faction; }
		if(typeof req.body.class !== 'undefined') { character.class = req.body.class; }
		if(typeof req.body.level !== 'undefined') { character.level = req.body.level; }
		if(typeof req.body.exp !== 'undefined') { character.exp = req.body.exp; }
		
		character.save()
		.then(function(character) {
			res.status(200).send(character);
//		}).catch(models.Character.ValidationError, function (err) {
//			winston.log('error', 'TEST TEST TEST');
//			winston.log('error', err.errors);
//			res.status(422).send(err.errors);
		}).catch(function(err) {
			winston.log('error', err);
			res.status(400).send(err);
		})
	}).catch(function(err) {
		winston.log('error', err);
		//res.status(400).send(err);
	});
});

/**
 * @api {put} /user/characters
 * @apiName DeleteUserCharacter
 * @apiGroup User
 * 
 * @apiHeader {String} Authorization "Bearer " + [JSON Web Token (JWT)]
 */
router.delete('/characters/:characterId', authenticate, function(req, res, next) {
	models.Character.find({where: {player_id: req.user.id, id: req.params.characterId}})
	.then(function(character) {
		character.destroy();
		res.status(200).send();	
	}).catch(function(err) {
		winston.log('error', err);
		res.status(200).send(err);
	});
});

/**
 * @api {put} /user/password UPDATE the user's password
 * @apiName PutUserPassword
 * @apiGroup User
 * 
 * @apiHeader {String} Authorization "Bearer " + [JSON Web Token (JWT)]
 */
router.put('/password', authenticate, function(req, res, next) {
	if(typeof req.body.old_password !== 'undefined' && typeof req.body.new_password !== 'undefined') {
		console.log(req.user.id);
		models.Person.findById(req.user.id)
		.then(function(person) {
			var old_password = req.body.old_password;
			var new_password = req.body.new_password;
			var current_password_hash = person.password;
			
			// Check original password
			if (bcrypt.compareSync(old_password, current_password_hash)) {
				var salt = bcrypt.genSaltSync(10);
                var new_password_hash = bcrypt.hashSync(new_password.replace(/\s/g, ''), salt);
				
                person.password = new_password_hash;
                person.save();        
				
				res.status(200).send('Password changed');	
			} else {
				res.status(400).send('Wrong password');
			}
			
		}).catch(function(err) {
			winston.log('error', err);
			res.status(400).send(err);
		});
	} else {
		res.status(400).send();
	}
});

module.exports = router;