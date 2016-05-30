/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Authors', {
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
    tableName: 'authors',
	instanceMethods: {
		// http://stackoverflow.com/questions/27972271/sequelize-dont-return-password
		// prevent the API from ever returning the password-hash or salt
		toJSON: function() {
			var values = this.get();

			delete values.created_at;
			delete values.updated_at;
			delete values.deleted_at;
			return values;
		}
	}
  });
};
