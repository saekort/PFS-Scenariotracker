// Load config
var config = {
		// Port the API should listen to
		'server_port':'8080',
		
		// Database connection variables
		'database_host':'localhost',
		'database_user':'root',
		'database_password':'',
		'database_name':'scenariotracker',
		'database_type':'mysql'
};

// Do not edit below this line
// ---------------------------

console.log('Loading PFS Scenariotracker API...');

// REST related includes
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//Load REST routes
var routes = require('./routes/index');
var persons = require('./routes/persons');
var scenarios = require('./routes/scenarios');

// ORM include
var Sequelize = require('sequelize');

var app = express();

// Setup database through sequelize ORM
var sequelize = new Sequelize(config['database_name'], config['database_user'], config['database_password'], {
	  host: config['database_host'],
	  dialect: config['database_type'],

	  pool: {
	    max: 5,
	    min: 0,
	    idle: 10000
	  }
	});

//Define models
console.log('Loading database models');
var Scenario = sequelize.import(__dirname + "/models/scenario");

sequelize.sync();

// Start the server
var server = app.listen(config['server_port'], function() {
	
	var host = server.address().address;
	var port = server.address().port;
	
	console.log('PFS Scenariotracker API listening at http://%s:%s', host, port);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public') ));

app.use('/', routes);
app.use('/persons', persons);
app.use('/scenarios', scenarios);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
