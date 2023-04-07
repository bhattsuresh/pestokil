'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     OrderItem.belongsTo(models.order);
    }
  };
  OrderItem.init({
    orderId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    category: DataTypes.STRING,
    name: DataTypes.STRING,
    model: DataTypes.STRING,
    sku: DataTypes.STRING,
    qty: DataTypes.FLOAT,
    pendingQty: DataTypes.FLOAT,
    price: DataTypes.FLOAT,
    hsnSac: DataTypes.STRING,
    tax: DataTypes.FLOAT,
    sortDesc: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'orderitem',
  });
  return OrderItem;
};