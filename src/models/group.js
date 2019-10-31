module.exports = function(sequelize, DataTypes) {
	var Group = sequelize.define('Group', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING(128),
			allowNull: true
		}
	}, {
		tableName: 'groups'
	});
  
	Group.associate = function(models) {
		Group.belongsTo(models.Person, {as: 'owner', foreignKey: 'owner_id'});
		Group.belongsToMany(models.Person, {as: 'members', foreignKey: 'group_id', through: 'j_group_person'});
	}
	
	// http://stackoverflow.com/questions/27972271/sequelize-dont-return-password
	// prevent the API from ever returning the deleted values
	Group.prototype.toJSON = function() {
		var values = this.get();

		delete values.created_on;
		delete values.updated_on;
		delete values.deleted_on;
		
		return values;
	}
	
	return Group;
};