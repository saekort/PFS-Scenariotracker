var router = require('express').Router();
var path = require('path'); // Handling and transforming file paths
var models = require('../models');
var env       = process.env.NODE_ENV || 'development'; // Environment
var config    = require(path.join(__dirname, '..', 'config', 'pfstracker.json'))[env];
var passport  = require('../middlewares/passportProvider');
var tokenizer = require('../helpers/tokenizer');
var winston = require('winston');

router.post('/login', passport.authenticate('local'), serialize, generateToken, function(req, res, next) {
	winston.log('info', 'User logged in with ID: ' + req.user.id);
	res.status(200).json({
		user: req.user,
		token: req.token
	});
});

router.post('/logout', passport.authenticate('local'), function(req, res, next){
		//	if (req.user) {
		//		var account = req.user;
		//		var token = tokenizer.getNewToken(account);
			res.status(200).send('TOKEN');
		//	} else {
		//		res.status(401).send({error: 'Invalid credentials'});
		//	}
});

router.post('/register', function(req, res, next) {
	
});

function serialize(req, res, next) {  
//	  db.updateOrCreate(req.user, function(err, user){
//	    if(err) {return next(err);}
//	    // we store the updated information in req.user again
//	    req.user = {
//	      id: user.id
//	    };
	    next();
//	  });
	}

const jwt = require('jsonwebtoken');

function generateToken(req, res, next) {  
	req.token = jwt.sign({
		id: req.user.id,
		pfsnumber: req.user.pfsnumber
	}, config.apiSecret, {
		expiresIn: config.jwtExpire
	});
	
	next();
}

module.exports = router;