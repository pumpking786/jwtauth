const sequelize = require("sequelize");
const db = new sequelize("test", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

// async function CreateTable() {
//   try {
//     // Drop the User table
//     await db.sync();
//     console.log("Db Table created!");
//   } catch (err) {
//     console.log("Error dropping User table", err.message);
//   }
// }

// // Call the function for the table
// CreateTable();

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
