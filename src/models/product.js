'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.category);
      Product.hasMany(models.shippingitem);
    }
  };
  Product.init({
    categoryId: DataTypes.INTEGER,
    image: DataTypes.STRING,
    name: DataTypes.STRING,
    model: DataTypes.STRING,
    sku: DataTypes.STRING,
    price: DataTypes.STRING,
    hsnSac: DataTypes.STRING,
    tax:DataTypes.FLOAT,
    quantity: DataTypes.INTEGER,
    min_quantity: DataTypes.INTEGER,
    stockStatus: DataTypes.INTEGER,
    active: DataTypes.INTEGER,
    sortDesc:DataTypes.STRING,
    longDesc:DataTypes.TEXT,
    date: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'product',
  });
  Product.addHook("beforeCreate", (obj) => {
    obj.date = app.date;
  });
  return Product;
};