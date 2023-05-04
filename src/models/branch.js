'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class branch extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  branch.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    code: DataTypes.STRING,
    invoice: DataTypes.STRING,
    certificate:DataTypes.STRING,
    active: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'branch',
  });
  return branch;
};