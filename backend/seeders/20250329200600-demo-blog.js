module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("blogs", [
      {
        title: "First Blog",
        description: "This is the first blog post.",
        user_id: 1, // Make sure user with id=1 exists
      },
      {
        title: "Second Blog",
        description: "This is the second blog post.",
        user_id: 2, // Make sure user with id=2 exists
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("blogs", null, {});
  },
};
