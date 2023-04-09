'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // define association here
      Category.hasMany(models.product);
      Category.hasMany(models.usercategory);
    }
  };
  Category.init({
    name: DataTypes.STRING,
    date: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'category',
  });

  Category.addHook("beforeCreate", (obj) => {
    obj.date = app.date;
  });
  return Category;
};