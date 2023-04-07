const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    static associate(models) {
      // define association here
    }
  }

  Admin.init(
    {
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      password: DataTypes.STRING,
      date: DataTypes.STRING,
      active: DataTypes.INTEGER,
      role: DataTypes.STRING,
      rights: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "admin",
    }
  );

  Admin.addHook("beforeCreate", (obj) => {
    const bcrypt = require("bcryptjs");
    const salt = bcrypt.genSaltSync();
    obj.date = app.date;
    obj.password = bcrypt.hashSync(obj.password, salt);
  });

   Admin.addHook("beforeUpdate", (obj) => {
    const bcrypt = require("bcryptjs");
    const salt = bcrypt.genSaltSync();
    obj.date = app.date;
    obj.password = bcrypt.hashSync(obj.password, salt);
  });
  return Admin;
};
