/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('logs', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    http: {
      type: DataTypes.STRING,
      allowNull: false
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'logs'
  });
};
