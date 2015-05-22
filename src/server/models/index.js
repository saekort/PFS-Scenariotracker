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
var Person = sequelize.import(__dirname + "/person");
var Subtier = sequelize.import(__dirname + "/subtier");
var Author = sequelize.import(__dirname + "/author");

// Author has scenarios, scenario has a author
Author.hasMany(Scenario, {as: 'Scenarios', foreignKey: 'author_id'});
Scenario.belongsTo(Author, {as: 'Author', foreignKey: 'author_id'});

// Scenario has subtiers, subtiers has scenarios
Scenario.belongsToMany(Subtier, {through: 'j_scenario_subtier', foreignKey: 'scenario_id'});
Subtier.belongsToMany(Scenario, {through: 'j_scenario_subtier', foreignKey: 'subtier_id'});

var db	= {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Scenario = Scenario;
db.Author = Author;
db.Subtier = Subtier;
db.Person = Person;

module.exports = db;

//sequelize.sync({force: true}).then(function() {
//	var scenario1 = Scenario.create({ 
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
//	
//	Subtier.create({
//		name: '1'
//	});
//	
//	Subtier.create({
//		name: '1-2'
//	});
//	
//	Subtier.create({
//		name: '3-4'
//	});
//	
//	Subtier.create({
//		name: '4-5'
//	});
//	
//	Subtier.create({
//		name: '5-6'
//	});	
//	
//	Subtier.create({
//		name: '6-7'
//	});
//	
//	Subtier.create({
//		name: '7'
//	});	
//	
//	Subtier.create({
//		name: '7-8'
//	});	
//	
//	Subtier.create({
//		name: '8-9'
//	});
//	
//	Subtier.create({
//		name: '10-11'
//	});
//	
//	Subtier.create({
//		name: '12'
//	});
//	
//	Author.create({	name: 'Richard Pett' }).then(function(author) {
//
//	});
//	Author.create({	name: 'Michael Kortes' });
//	Author.create({	name: 'Tim Hitchcock' });
//	Author.create({	name: 'Greg A. Vaughan' });
//}).then(function() {
//	
//});