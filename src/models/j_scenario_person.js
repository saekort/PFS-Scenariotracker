module.exports = function(sequelize, DataTypes) {
	var J_scenario_person = sequelize.define('j_scenario_person', {
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
		pfs: {
			type: DataTypes.DATE,
			allowNull: true
		},
		core: {
			type: DataTypes.DATE,
			allowNull: true
		},
		pfs2: {
			type: DataTypes.DATE,
			allowNull: true
		},
		pfs2_gm: {
			type: DataTypes.DATE,
			allowNull: true
		},
		sfs: {
			type: DataTypes.DATE,
			allowNull: true    	
		},
		pfs_gm: {
			type: DataTypes.DATE,
			allowNull: true
		},
		core_gm: {
			type: DataTypes.DATE,
			allowNull: true
		},
		sfs_gm: {
			type: DataTypes.DATE,
			allowNull: true
		}
	}, {
		tableName: 'j_scenario_person'
	});
	
	J_scenario_person.associate = function(models) {
		J_scenario_person.belongsTo(models.Scenario, {as: 'scenario', foreignKey: 'scenario_id'});
	}
	
	return J_scenario_person;
};
