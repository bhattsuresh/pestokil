'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('branches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      code: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      invoice: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
      certificate: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
      active: {
        type: Sequelize.INTEGER(1),
        allowNull: true,
        defaultValue: "0"
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('branches');
  }
};