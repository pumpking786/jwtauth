const sequelize = require("sequelize");
const db = new sequelize("test", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

const connection = async () => {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
  }
};
connection();

module.exports = db;
