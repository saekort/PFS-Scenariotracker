module.exports = function(sequelize, DataTypes) {
	var Statistic = sequelize.define('Statistic', {
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    number: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
//    scenario_id: {
//      type: DataTypes.INTEGER(11),
//      allowNull: true
//    },
//    person_id: {
//      type: DataTypes.INTEGER(11),
//      allowNull: true
//    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'statistics',
    classMethods: {
    	associate: function(models) {
    		Statistic.belongsTo(models.Scenario, {as: 'scenario'});
    		Statistic.belongsTo(models.Person, {as: 'person'});
    		//Statistic.belongsTo(models.Scenario, {foreignKey: 'scenario_id', as: 'scenario'});
    		//Statistic.belongsTo(models.Person, {foreignKey: 'person_id', as: 'person'});
    	}
    },
	instanceMethods: {
		// http://stackoverflow.com/questions/27972271/sequelize-dont-return-password
		// prevent the API from ever returning the password-hash or salt
		toJSON: function() {
			var values = this.get();

			//delete values.created_at;
			delete values.updated_at;
			delete values.deleted_at;
			return values;
		}
	}
  });
  
  return Statistic;
};
