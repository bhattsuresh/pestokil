'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shipping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Shipping.belongsTo(models.user);
      Shipping.belongsTo(models.order);
      Shipping.hasMany(models.shippingitem);
    }
  };
  Shipping.init({
    userId: DataTypes.INTEGER,
    orderId: DataTypes.INTEGER,
    dispatchFrom: DataTypes.TEXT,
    vehicleNumber: DataTypes.STRING,
    shipperContact: DataTypes.STRING,
    detail: DataTypes.TEXT,
    amount: DataTypes.FLOAT,
    status: DataTypes.STRING,
    active: DataTypes.INTEGER,
    sendToUser: DataTypes.INTEGER,
    date: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'shipping',
  });
  return Shipping;
};