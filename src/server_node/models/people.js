/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('People', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pfsnumber: {
      type: DataTypes.INTEGER(11),
      allowNull: true
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
    tableName: 'People'
  });
};
