const sequelize = require("sequelize");
const config = require("../config/config.json")["development"];
const db = new sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: "mysql",
});

// async function CreateTable() {
//   try {
//     // Create tables(Other acts can be done through here)
//     await db.sync();
//     console.log("Db Table created!");
//   } catch (err) {
//     console.log("Error creating table", err.message);
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
