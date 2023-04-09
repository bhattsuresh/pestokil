'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      razorpayOrderId: {
        type: Sequelize.STRING(50)
      },
      subTotal: {
        type: Sequelize.FLOAT
      },
      discount: {
        type: Sequelize.FLOAT
      },
      tax: {
        type: Sequelize.FLOAT
      },
      extra_tax: {
        type: Sequelize.FLOAT
      },
      total: {
        type: Sequelize.FLOAT
      },
      pendingQty: {
        type: Sequelize.FLOAT
      },
      routeNumber: {
        type: Sequelize.STRING(100)
      },
      orderStatus: {
        type: Sequelize.STRING(30)
      },
      statusNote: {
        type: Sequelize.TEXT
      },
      acceptedDate: {
        type: Sequelize.STRING(20)
      },  
      paymentStatus: {
        type: Sequelize.STRING(30)
      },
      orderAddress: {
        type: Sequelize.TEXT
      },
      paymentMethod: {
        type: Sequelize.STRING(30)
      },
      paymentProof: {
        type: Sequelize.STRING(100)
      },
      purchaseOrder: {
        type: Sequelize.STRING(25)
      },
      time: {
        type: Sequelize.STRING(20)
      },
      date: {
        type: Sequelize.STRING(20)
      },
      isTrash: {
        type: Sequelize.INTEGER
      },
      isActive: {
        type: Sequelize.INTEGER
      },
      orderNote: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('Orders');
  }
};