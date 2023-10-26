"use strict";

const fs = require("fs");
const filename = "./data/tags.json";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    const tags = JSON.parse(fs.readFileSync(filename));
    tags.forEach((tag) => {
      tag.createdAt = new Date();
      tag.updatedAt = new Date();
    });

    await queryInterface.bulkInsert("Tags", tags);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("Tags", null, {});
  },
};
