'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ShippingItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
       ShippingItem.belongsTo(models.product);
       ShippingItem.belongsTo(models.shipping);
    }
  };
  ShippingItem.init({
    shippingId: DataTypes.INTEGER,
    orderItemId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    category: DataTypes.STRING,
    name: DataTypes.STRING,
    sortDesc: DataTypes.TEXT,
    qty: DataTypes.FLOAT,
    hsnSac: DataTypes.STRING,
    tax: DataTypes.FLOAT,
    rate: DataTypes.FLOAT,
    status: DataTypes.STRING,
    active: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'shippingitem',
  });
  return ShippingItem;
};