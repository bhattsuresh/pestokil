
'use strict';
var bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync();

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("users", [
      {
        firstName: "John",
        lastName: "Doe",
        email: "a",
        phone: "9999999999",
        date: new Date().getFullYear(),
        password: bcrypt.hashSync("a", salt),
        active:1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  }
};
