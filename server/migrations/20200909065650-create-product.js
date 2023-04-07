"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Products", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      categoryId: {
        type: Sequelize.INTEGER,
      },
      image: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      model: {
        type: Sequelize.STRING,
      },
      sku: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.FLOAT,
      },
      hsnSac: {
        type: Sequelize.STRING(50),
      },
      tax: {
        type: Sequelize.FLOAT,
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
      min_quantity: {
        type: Sequelize.INTEGER,
      },
      stockStatus: {
        type: Sequelize.INTEGER,
      },
      active: {
        type: Sequelize.INTEGER,
      },
      sortDesc: {
        type: Sequelize.STRING,
      },
      longDesc: {
        type: Sequelize.TEXT,
      },
      date: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Products");
  },
};
