module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Scenario', {
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
		    archived: {
		      type: DataTypes.DATE,
		      allowNull: true
		    },
		    created_on: {
		      type: DataTypes.DATE,
		      allowNull: false
		    },
		    updated_on: {
		      type: DataTypes.DATE,
		      allowNull: false
		    },
		    deleted: {
		      type: DataTypes.DATE,
		      allowNull: true
		    }
		  }, {
			  tableName: 'scenarios'
		  });
};
