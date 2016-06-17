var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressJWT = require('express-jwt');
var jwt    = require('jsonwebtoken'); // Used to create, sign and verify tokens
var tokenizer = require('./helpers/tokenizer');

var env       = process.env.NODE_ENV || 'development'; // Environment
var config    = require(path.join(__dirname, '', 'config', 'pfstracker.json'))[env];

var app = express();

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    next();
};

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/apidoc', express.static(path.join(__dirname, 'apidoc')));

app.use(allowCrossDomain);

var permissionCheck = function(req, res, next) {
	 if (req.user !== undefined) {
	     tokenizer.refreshToken(req.user, res);
	 }

	 next();
}

module.exports = app;