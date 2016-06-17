var passport  = require('passport');
var Strategy  = require('passport-local').Strategy;
var models    = require('../models');
var app       = require('../app');
var path      = require('path'); // Handling and transforming file paths
var env       = process.env.NODE_ENV || 'development'; // Environment
var config    = require(path.join(__dirname, '..', 'config', 'pfstracker.json'))[env];
var bcrypt    = require('bcryptjs');

passport.use(new Strategy( {
	session: false
	}, function(username, password, cb) {
			if(typeof username !== 'undefined' && typeof password !== 'undefined')
	        {
				models.Person.findOne({where: {email: username}})
				.then(function(account) {
					// https://www.npmjs.com/package/bcryptjs
					var hash = account.password;
					
					// Compare the 'hash' with a bcrypted password
					if (bcrypt.compareSync(password, hash)) {
						// Valid credentials
						return cb(null, {id: account.id, name: account.name});
					} else {
						// Invalid credentials
						return cb(null, false);
					}
				}).catch(function(error) {
					console.log(error);
					return false;
				});
	        } else {
				return false;
			}
		}
	));

passport.serializeUser(function(account, cb) {
    cb(null, account.id);
});

passport.deserializeUser(function(id, cb) {
	cb(null, false);
});

app.use(passport.initialize());

module.exports = passport;