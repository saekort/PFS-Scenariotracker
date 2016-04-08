/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('statistics', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    number: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    scenario_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    person_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true
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
    tableName: 'statistics'
  });
};
