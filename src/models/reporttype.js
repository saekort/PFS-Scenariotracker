module.exports = function(sequelize, DataTypes) {
	var Reporttype = sequelize.define('Reporttype', {
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
		tableName: 'reporttypes'
	});
	
	Reporttype.prototype.toJSON = function() {
		var values = this.get();
		
		delete values.created_on;
		delete values.updated_on;
		delete values.deleted_on;
		
		return values;
	}
  
  return Reporttype;
};