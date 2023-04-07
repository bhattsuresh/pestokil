'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.order);
      User.hasMany(models.shipping);
      User.hasMany(models.ordercomplaint);
    }
  };
  User.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    password: DataTypes.STRING,
    siteCode:DataTypes.STRING,
    gstNumber:DataTypes.STRING,
    panNumber:DataTypes.STRING,
    address: {
      type: DataTypes.TEXT,
      get: function() {
      var add = this.getDataValue("address") == undefined ? null : this.getDataValue("address");
      return add;
        //return JSON.parse(add);
      },
      set: function(value) {
        return this.setDataValue("address", JSON.stringify(value));
      }
    },
    active: DataTypes.INTEGER,
    tsc: DataTypes.INTEGER,
    credit: DataTypes.INTEGER,
    date: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  User.addHook("beforeCreate", (obj) => {
    const bcrypt = require("bcryptjs");
    const salt = bcrypt.genSaltSync();
    obj.date = app.date;
    obj.password = bcrypt.hashSync(obj.password, salt);
  });

  User.addHook('beforeUpdate', (obj) => {
    const bcrypt = require("bcryptjs");
    const salt = bcrypt.genSaltSync();
  
    obj.password = bcrypt.hashSync(obj.password, salt);
  });

  return User;
};