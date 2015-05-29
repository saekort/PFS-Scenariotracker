module.exports = function(sequelize, DataTypes) {
	  return sequelize.define("Author", {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
				validate: {
					isNumeric: true
				}
			},
			name: {
				type: DataTypes.STRING(64)
			},
		},{
			name: {
				singular: 'author',
				plural: 'authors'
			},			
			timestamps: true,
			deletedAt: 'deleted',	
			createdAt: 'created_on',
			updatedAt: 'updated_on',
			paranoid: true,
			classMethods: {
				associate: function(models) {
					models.Author.hasMany(models.Scenario, {as: 'Scenarios', foreignKey: 'author_id'});
				}
			}
		});
	};