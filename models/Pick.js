
module.exports = function(sequelize, DataTypes){
  var Pick = sequelize.define("Pick", {
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  week: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  pickedTeam: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

Pick.associate = function(models) {
    Pick.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

return Pick;
}
