module.exports = function(sequelize, DataTypes) {
	var Game = sequelize.define('Game', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		shortname: {
			type: DataTypes.STRING,
			allowNull: true
		},
		longname: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		tableName: 'games'
	});
	
	Game.associate = function(models) {
		Game.hasMany(models.Scenario, {as: 'scenarios', foreignKey: 'game_id'});
	}

	Game.prototype.toJSON = function() {
		var values = this.get();
		
		delete values.id;
		delete values.created_on;
		delete values.updated_on;
		delete values.deleted_on;
		
		return values;
	}
  
  return Game;
};