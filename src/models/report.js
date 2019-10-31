module.exports = function(sequelize, DataTypes) {
	var Report = sequelize.define('Report', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		scenario_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		person_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		character_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		reporttype_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		level: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		replay: {
			type: DataTypes.STRING,
			allowNull: true
		},
		wanted: {
			type: DataTypes.STRING,
			allowNull: true
		},
		comment: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		played_on: {
			type: DataTypes.DATE,
			allowNull: false
		}
	}, {
		tableName: 'reports'
	});
	
	Report.associate = function(models) {
		Report.belongsTo(models.Scenario, {as: 'scenario', foreignKey: 'scenario_id'});
		Report.belongsTo(models.Person, {as: 'person', foreignkey: 'person_id'});
		Report.belongsTo(models.Character, {as: 'character', foreignKey: 'character_id'});
		Report.belongsTo(models.Reporttype, {as: 'reporttype', foreignKey: 'reporttype_id'});
	}
	
	// http://stackoverflow.com/questions/27972271/sequelize-dont-return-password
	// prevent the API from ever returning the deleted values
	Report.prototype.toJSON = function() {
		var values = this.get();

		delete values.created_on;
		delete values.updated_on;
		delete values.deleted_on;
		
		return values;
	}
	
	return Report;
};