const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("Pramit", 10);

    await queryInterface.bulkInsert("users", [
      {
        email: "pramitamatya786@gmail.com",
        username: "Pramit",
        password: hashedPassword,
        age: 22,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
