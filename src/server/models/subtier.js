module.exports = function(sequelize, DataTypes) {
	  return sequelize.define("Subtier", {
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
				type: DataTypes.STRING(16)
			},
		},{
			name: {
				singular: 'subtier',
				plural: 'subtiers'
			},
			timestamps: true,
			deletedAt: 'deleted',	
			createdAt: 'created_on',
			updatedAt: 'updated_on',
			paranoid: true,
			classMethods: {}
		});
	};