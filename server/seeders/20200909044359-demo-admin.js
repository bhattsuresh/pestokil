"use strict";
var bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync();

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("admins", [
      {
        firstName: "Admin",
        lastName: "Doe",
        email: "admin",
        phone: "9999999999",
        date: new Date().getFullYear(),
        password: bcrypt.hashSync("admin", salt),
        active:1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("admins", null, {});
  },
};
