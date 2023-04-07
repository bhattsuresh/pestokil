'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderComplaint extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      OrderComplaint.belongsTo(models.user);
    }
  };
  OrderComplaint.init({
    userId: DataTypes.INTEGER,
    orderId: DataTypes.INTEGER,
    ticket: DataTypes.STRING(50),
    subject: DataTypes.STRING,
    complaint: DataTypes.TEXT,
    status: DataTypes.STRING,
    response: DataTypes.TEXT,
    active: DataTypes.INTEGER,
    date: DataTypes.STRING(20),
    closeDate: DataTypes.STRING(25)
  }, {
    sequelize,
    modelName: 'ordercomplaint',
  });
  return OrderComplaint;
};