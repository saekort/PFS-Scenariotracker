module.exports = function(sequelize, DataTypes) {
	var Statistic = sequelize.define('Statistic', {
		type: {
			type: DataTypes.STRING,
			allowNull: false
		},
		number: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		comment: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		tableName: 'statistics'
	});
	
	Statistic.associate = function(models) {
		Statistic.belongsTo(models.Scenario, {as: 'scenario'});
		Statistic.belongsTo(models.Person, {as: 'person'});
		//Statistic.belongsTo(models.Scenario, {foreignKey: 'scenario_id', as: 'scenario'});
		//Statistic.belongsTo(models.Person, {foreignKey: 'person_id', as: 'person'});
	}
  
	// http://stackoverflow.com/questions/27972271/sequelize-dont-return-password
	// prevent the API from ever returning the password-hash or salt
	Statistic.prototype.toJSON = function() {
		var values = this.get();

		delete values.updated_at;
		delete values.deleted_at;
		return values;
	}
	
  return Statistic;
};
