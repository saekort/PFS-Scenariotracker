module.exports = function(sequelize, DataTypes) {
	  return sequelize.define("Scenario", {
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
				type: DataTypes.STRING,
				allowNull: false
			},
			description: {
				type: DataTypes.TEXT
			},
			type: {
				type: DataTypes.STRING(64),
				defaultValue: 'scenario',
				allowNull: false
			},
			season: {
				type: DataTypes.STRING(16)
			},
			number: {
				type: DataTypes.STRING(16)
			},
			tier: {
				type: DataTypes.STRING(16)
			},
			evergreen: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			archived: {
				type: DataTypes.DATE,
				defaultValue: null
			}
		},{
			name: {
				singular: 'scenario',
				plural: 'scenarios'
			},
			timestamps: true,
			deletedAt: 'deleted',
			createdAt: 'created_on',
			updatedAt: 'updated_on',
			paranoid: true,
			classMethods: {
				associate: function(models) {
					models.Scenario.belongsToMany(models.Author, {as: 'Authors', through: 'j_author_scenario', foreignKey: 'scenario_id'});
				}
			}
		});
	};