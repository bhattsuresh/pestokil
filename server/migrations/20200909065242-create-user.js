'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      company: {
        type: Sequelize.INTEGER
      },
      firstname: {
        type: Sequelize.STRING
      },
      lastname: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING
      },
      siteCode: {
        type: Sequelize.STRING(50)
      },
      gstNumber: {
        type: Sequelize.STRING(50)
      },
      panNumber: {
        type: Sequelize.STRING(30)
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      active: {
        type: Sequelize.INTEGER(1),
        allowNull: true,
        defaultValue: "0",
      },
      tsc: {
        type: Sequelize.INTEGER(1),
        allowNull: true,
        defaultValue: "0"
      }, 
      credit: {
        type: Sequelize.INTEGER(1),
        allowNull: true,
        defaultValue: "0"
      },
      date: {
        type: Sequelize.STRING(20)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};