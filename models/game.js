module.exports = function(sequelize, DataTypes){

  var Game = sequelize.define("Game", {
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  week: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  homeTeam: {
    type: DataTypes.STRING,
    allowNull: false
  },
  awayTeam: {
    type: DataTypes.STRING,
    allowNull: false
  },
  win: {
    type: DataTypes.STRING,
  }
});

  return Game;

}