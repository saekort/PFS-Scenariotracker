module.exports = function(sequelize, DataTypes) {
	var Author = sequelize.define('Author', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		tableName: 'authors'
	});
	
	Author.associate = function(models) {
		Author.belongsToMany(models.Scenario, {as: 'scenarios', foreignKey: 'author_id', through: 'j_author_scenario'});
	}
	
	// http://stackoverflow.com/questions/27972271/sequelize-dont-return-password
	// prevent the API from ever returning the deleted values
	Author.prototype.toJSON = function() {
		var values = this.get();

		delete values.created_at;
		delete values.updated_at;
		delete values.deleted_at;
		
		return values;
	}
  
  return Author;
};