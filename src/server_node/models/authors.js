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
    tableName: 'authors'
  });
};
