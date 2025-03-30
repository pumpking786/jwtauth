"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "blogs",
      "lesson", // The column name
      {
        type: Sequelize.STRING, // Data type for the new column (Lesson)
        allowNull: false, // Column must have a value (can't be NULL)
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("blogs", "lesson"); // This removes the 'lesson' column if the migration is reverted
  },
};
