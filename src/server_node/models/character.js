module.exports = function(sequelize, DataTypes) {
  var Character = sequelize.define('Character', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    player_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    number: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    level: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0
    },
    faction: {
      type: DataTypes.STRING,
      allowNull: false
    },
    class: {
      type: DataTypes.STRING,
      allowNull: false
    },
    campaign: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'PFS'
    },
    exp: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: 'characters',
  });
  
	// http://stackoverflow.com/questions/27972271/sequelize-dont-return-password
	// prevent the API from ever returning the deleted values
	Character.prototype.toJSON = function() {
		var values = this.get();

		delete values.created_at;
		delete values.updated_at;
		delete values.deleted_at;
		
		return values;
	}
  
  return Character;
};
