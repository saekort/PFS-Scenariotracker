module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Scenarios', {
		id: {
		  type: DataTypes.INTEGER(11),
		  allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
		},
		name: {
		  type: DataTypes.STRING,
		  allowNull: false
		},
		description: {
		  type: DataTypes.TEXT,
		  allowNull: true
		},
		type: {
		  type: DataTypes.STRING,
		  allowNull: false,
		  defaultValue: 'scenario'
		},
		season: {
		  type: DataTypes.STRING,
		  allowNull: false,
		  defaultValue: '99'
		},
		number: {
		  type: DataTypes.STRING,
		  allowNull: true
		},
		tier: {
		  type: DataTypes.STRING,
		  allowNull: true
		},
		levelrange: {
		  type: DataTypes.STRING,
		  allowNull: false,
		  defaultValue: '01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20'
		},
		link: {
		  type: DataTypes.STRING,
		  allowNull: true
		},
		evergreen: {
		  type: DataTypes.BOOLEAN,
		  allowNull: true,
		  defaultValue: '0'
		},
		archived_at: {
			type: DataTypes.DATE,
			allowNull: true
		}
	}, {
		tableName: 'scenarios',
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