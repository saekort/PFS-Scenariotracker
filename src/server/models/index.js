// Setup ORM
var Sequelize = require('sequelize');

var config = require(__dirname + '/../config/config.json');

//Setup database through sequelize ORM
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
var Scenario = sequelize.import(__dirname + "/scenario");

var db	= {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Scenario = Scenario;

module.exports = db;

sequelize.sync({force: true}).then(function() {
	var data = [
               	Scenario.create({ 
               		name: "Silent Tide", 
               		description: "When strange reports of misty undead spread through Absalom, you and your fellow Pathfinders are dispatched to the half-drowned district of Puddles. Notoriously rough, the drooling addicts, flesh panderers, and quick-handed knifers of Puddles are the least of your worries. The night's tide brings with it an ancient armada of some long-forgotten war and you are the only thing between their mist-shrouded ghost fleet and Absalom's utter oblivion.",
               		season: "0",
               		number: "1",
               		tier: "1-5"
               	}),
               	Scenario.create({ 
               		name: "The Hydra's Fang Incident", 
               		description: "After an Andoren village is razed by the Hydra's Fang, a renegade Chelish slaver-ship, outrage threatens the stability of both nations. You and your fellow Pathfinders are sent to capture the Fang before the Inner Sea is pitched into political frenzy.",
               		season: "0",
               		number: "2",
               		tier: "1-5"
               	})	            
	            ];
	Sequelize.Promise.all(data);
});