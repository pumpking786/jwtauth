const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("password123", 10);

    await queryInterface.bulkInsert("users", [
      {
        email: "user1@example.com",
        username: "user1",
        password: hashedPassword,
      },
      {
        email: "user2@example.com",
        username: "user2",
        password: hashedPassword,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
