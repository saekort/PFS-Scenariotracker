"use strict";

// Setup ORM
var fs        = require("fs");
var path      = require("path");
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

var db	= {};

// Grab all models and load them
fs
	.readdirSync(__dirname)
	.filter(function(file) {
		return (file.indexOf(".") !== 0) && (file !== "index.js");
	})
	.forEach(function(file) {
		var model = sequelize["import"](path.join(__dirname, file));
		db[model.name] = model;
	});

Object.keys(db).forEach(function(modelName) {
	if ("associate" in db[modelName]) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
