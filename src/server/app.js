console.log('Loading PFS Scenariotracker API...');

// REST related includes
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//Load REST routes
//var routes = require('./routes/index');
//var persons = require('./routes/persons');
//var scenarios = require('./routes/scenarios');

// Load config
var config = require(__dirname + '/config/config.json');

var app = express();
app.use(require('./controllers'));

////Define models
//console.log('Loading database models');
//var Scenario = sequelize.import(__dirname + "/models/scenario");
//
//// Load test data creation
//sequelize.sync({force: true}).then(function() {
//	Scenario.create({ 
//		name: "Silent Tide", 
//		description: "When strange reports of misty undead spread through Absalom, you and your fellow Pathfinders are dispatched to the half-drowned district of Puddles. Notoriously rough, the drooling addicts, flesh panderers, and quick-handed knifers of Puddles are the least of your worries. The night's tide brings with it an ancient armada of some long-forgotten war and you are the only thing between their mist-shrouded ghost fleet and Absalom's utter oblivion.",
//		season: "0",
//		number: "1",
//		tier: "1-5"
//	});
//
//	Scenario.create({ 
//		name: "The Hydra's Fang Incident", 
//		description: "After an Andoren village is razed by the Hydra's Fang, a renegade Chelish slaver-ship, outrage threatens the stability of both nations. You and your fellow Pathfinders are sent to capture the Fang before the Inner Sea is pitched into political frenzy.",
//		season: "0",
//		number: "2",
//		tier: "1-5"
//	});
//});

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
