module.exports = function(sequelize, DataTypes) {
	var J_group_person = sequelize.define('j_group_person', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    group_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    person_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'j_group_person',
	classMethods: {
		associate: function(models) {
			J_group_person.belongsTo(models.Group, {as: 'group', foreignKey: 'group_id'});
		}
	}
  });
	
	return J_group_person;
};
