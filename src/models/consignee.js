'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class consignee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  consignee.init({
    company: DataTypes.STRING,
    name: DataTypes.STRING,
    address: DataTypes.TEXT,
    address2: DataTypes.TEXT,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    pincode: DataTypes.INTEGER,
    mobile: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    active: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'consignee',
  });
  return consignee;
};