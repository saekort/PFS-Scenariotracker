module.exports = function(sequelize, DataTypes) {
	var Person = sequelize.define('Person', {
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
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: { isEmail: true }
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		pfsnumber: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			validate: {
				isUnique: function(value, next) {
					var self = this;
					Person.find({where: {pfsnumber: value}})
					.then(function(person) {
						if(person && person.id !== self.id) {
							return next('PFSnumber already in use!');
						}
						return next();
					}).catch(function(err) {
						return next(err);
					});
				}
			}
		},
		admin: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: '0'
		},
		country: {
			type: DataTypes.STRING,
			allowNull: true
		},
		public: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: '0'
		},
		public_characters: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: '0'
		},
		ip_address: {
			type: DataTypes.STRING,
			allowNull: false
		},
		last_login: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		forgotten_password_code: {
			type: DataTypes.STRING,
			allowNull: true
		},
		forgotten_password_time: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		remember_code: {
			type: DataTypes.STRING,
			allowNull: true
		},
		key: {
			type: DataTypes.STRING,
			allowNull: true
		},
		key_expire: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		active: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: '1'
		}
	}, {
		tableName: 'people',
	});

	Person.associate = function(models) {
		Person.hasMany(models.Statistic, {as: 'statistics', foreignKey: 'person_id'});
		Person.belongsToMany(models.Scenario, {as: 'scenarios', foreignKey: 'person_id', through: models.j_scenario_person});
//		Person.belongsToMany(models.Group, {as: 'groupMemberships', foreignKey: 'person_id', through: 'j_group_person'});
//		Person.belongsToMany(models.Group, {as: 'groupUsers', foreignKey: 'person_id', through: 'j_group_person'});
	}
  
	// http://stackoverflow.com/questions/27972271/sequelize-dont-return-password
	// prevent the API from ever returning the password-hash or salt
  	Person.prototype.toJSON = function() {
		var values = this.get();

		delete values.email;
		delete values.deleted_at;
		delete values.key;
		delete values.key_expire;
		delete values.password;
		delete values.salt;
		delete values.ip_address;
		delete values.last_login;
		delete values.forgotten_password_code;
		delete values.forgotten_password_time;
		delete values.remember_code;
		delete values.active;
		
		return values;
	}

	return Person;
};
