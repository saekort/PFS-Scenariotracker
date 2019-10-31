/**
 * Migration

UPDATE `scenarios`
SET `game_id` = 1 
WHERE `scenarios`.`game` = 'pfs';

UPDATE `scenarios`
SET `game_id` = 2 
WHERE `scenarios`.`game` = 'pfs2';

UPDATE `scenarios`
SET `game_id` = 3 
WHERE `scenarios`.`game` = 'sfs';

// No need to migrate acg, no acg in before migration
 */

module.exports = function(sequelize, DataTypes) {
	var Scenario = sequelize.define('Scenario', {
		id: {
		  type: DataTypes.INTEGER(11),
		  allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
		},
		name: {
		  type: DataTypes.STRING,
		  allowNull: false
		},
		description: {
		  type: DataTypes.TEXT,
		  allowNull: true
		},
		type: {
		  type: DataTypes.STRING,
		  allowNull: false,
		  defaultValue: 'scenario'
		},
		season: {
		  type: DataTypes.STRING,
		  allowNull: false,
		  defaultValue: '99'
		},
		number: {
		  type: DataTypes.STRING,
		  allowNull: true
		},
		tier: {
		  type: DataTypes.STRING,
		  allowNull: true
		},
		levelrange: {
		  type: DataTypes.STRING,
		  allowNull: false,
		  defaultValue: '01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20'
		},
		link: {
		  type: DataTypes.STRING,
		  allowNull: true
		},
		evergreen: {
		  type: DataTypes.BOOLEAN,
		  allowNull: true,
		  defaultValue: '0'
		},
		quest: {
			  type: DataTypes.BOOLEAN,
			  allowNull: true,
			  defaultValue: '0'
			},
		multitable: {
			  type: DataTypes.BOOLEAN,
			  allowNull: true,
			  defaultValue: '0'
			},
		archived_on: {
			type: DataTypes.DATE,
			allowNull: true
		}
	}, {
		tableName: 'scenarios'
	});
	
	Scenario.associate = function(models) {
		Scenario.belongsTo(models.Game, {as: 'game', foreignKey: 'game_id'})
		Scenario.belongsToMany(models.Author, {as: 'authors', foreignKey: 'scenario_id', through: 'j_author_scenario'});
		Scenario.hasMany(models.Statistic, {as: 'statistics', foreignKey: 'scenario_id'});
		Scenario.hasMany(models.Report, {as: 'reports', foreignKey: 'scenario_id'});
		Scenario.belongsToMany(models.Person, {as: 'players', foreignKey: 'scenario_id', through: models.Report});
	}

	// http://stackoverflow.com/questions/27972271/sequelize-dont-return-password
	// prevent the API from ever returning the deleted values
	Scenario.prototype.toJSON = function() {
		var values = this.get();

		delete values.created_on;
		delete values.updated_on;
		delete values.deleted_on;
		
		return values;
	}
	
	return Scenario;
};
