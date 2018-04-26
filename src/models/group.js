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
		Group.belongsToMany(models.Person, {as: 'users', foreignKey: 'group_id', through: 'j_group_user'});
	}
	
	// http://stackoverflow.com/questions/27972271/sequelize-dont-return-password
	// prevent the API from ever returning the deleted values
	Group.prototype.toJSON = function() {
		var values = this.get();

		delete values.created_at;
		delete values.updated_at;
		delete values.deleted_at;
		
		return values;
	}
	
	return Group;
};