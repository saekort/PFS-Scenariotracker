module.exports = function(sequelize, DataTypes) {
	var Wanted = sequelize.define('Wanted', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		comment: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		tableName: 'wanted'
	});
	
	Wanted.associate = function(models) {
		Wanted.belongsTo(models.Scenario, {as: 'scenario', foreignKey: 'scenario_id'});
		Wanted.belongsTo(models.Person, {as: 'person', foreignkey: 'person_id'});
		Wanted.belongsTo(models.Character, {as: 'character', foreignKey: 'character_id'});
	}

	Wanted.prototype.toJSON = function() {
		var values = this.get();
		
		delete values.id;
		delete values.created_on;
		delete values.updated_on;
		delete values.deleted_on;
		
		return values;
	}
  
  return Wanted;
};