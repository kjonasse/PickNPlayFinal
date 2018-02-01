var bcrypt = require('bcrypt');


module.exports = function(sequelize, DataTypes){



    // setup User model and its fields.
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);
      }
    }
  });

  User.prototype.validPassword = function(password) {
    var passwordCheck = bcrypt.compareSync(password, this.password);
    console.log("password Check: ", passwordCheck);
    return passwordCheck;
  };

  User.associate = function(models) {
    User.hasMany(models.Pick, {
      as: "Picks"
    });
  };

  return User;

}