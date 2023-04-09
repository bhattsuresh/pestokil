'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.user);
      Order.hasMany(models.shipping);
      Order.hasMany(models.orderitem);
    }
  };
  Order.init({
    userId: DataTypes.INTEGER,
    razorpayOrderId:DataTypes.STRING,
    subTotal: DataTypes.FLOAT,
    discount: DataTypes.FLOAT,
    tax: DataTypes.FLOAT,
    extraTax:DataTypes.FLOAT,
    total: DataTypes.FLOAT,
    pendingQty: DataTypes.FLOAT,
    routeNumber: DataTypes.STRING(100),
    orderStatus: DataTypes.STRING(30),
    statusNote: DataTypes.TEXT,
    acceptedDate: DataTypes.STRING(20),
    paymentStatus: DataTypes.STRING(30),
    orderAddress: DataTypes.TEXT,
    paymentMethod:DataTypes.STRING(30),
    paymentProof:DataTypes.STRING(100),
    purchaseOrder:DataTypes.STRING(25),
    time: DataTypes.STRING(20),
    date: DataTypes.STRING(20),
    isTrash: DataTypes.INTEGER,
    isActive: DataTypes.INTEGER,
    orderNote: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'order',
  });
  return Order;
};