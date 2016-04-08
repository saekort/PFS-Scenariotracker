module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Characters', {
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
      allowNull: false
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
    tableName: 'Characters'
  });
};
