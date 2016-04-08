/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('j_scenario_person', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    scenario_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    person_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    pfs: {
      type: DataTypes.DATE,
      allowNull: true
    },
    core: {
      type: DataTypes.DATE,
      allowNull: true
    },
    pfs_gm: {
      type: DataTypes.DATE,
      allowNull: true
    },
    core_gm: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'j_scenario_person'
  });
};
