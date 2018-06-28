var express = require('express');
var forceDomain = require('express-force-domain');
var helmet = require('helmet');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken'); // Used to create, sign and verify tokens
var tokenizer = require('./helpers/tokenizer');

var env = process.env.NODE_ENV || 'development'; // Environment
var config = require(path.join(__dirname, '', 'config', 'pfstracker.json'))[env];
var config_server = require(path.join(__dirname, '', 'config', 'server.json'))[env];

var app = express();

// If in a production environment, force a base URL for canonical redirection
if(env == 'production') {
	app.use(forceDomain(config_server.hostname));
}

// Set any HTTP headers
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('X-Frame-Options', 'DENY');
    res.header('Content-Security-Policy', "default-src 'none'; script-src 'self' 'unsafe-eval' 'unsafe-inline' ajax.googleapis.com cdnjs.cloudflare.com; connect-src 'self'; img-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'");
    
	next();
});

// Set security headers with helmet: https://helmetjs.github.io/
app.use(helmet());

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/apidoc', express.static(path.join(__dirname, 'apidoc')));

app.use(expressJWT({ secret: config.apiSecret, credentialsRequired: false }), function(req, res, next){
	if (req.user !== undefined) {
		//tokenizer.refreshToken(req.user, res);
	}

	next();
});

var permissionCheck = function(req, res, next) {
	 if (req.user !== undefined) {
	     tokenizer.refreshToken(req.user, res);
	 }

	 next();
}

module.exports = app;