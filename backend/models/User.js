const {DataTypes}=require('sequelize')
const db=require("../config/db")

const User=db.define('User',{
    // 'id' will be automatically added by default as an auto-incrementing primary key in Sequelize
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // Automatically incrementing ID
  },
  
  // 'email' column with unique, not-null, and email format validation
  email: {
    type: DataTypes.STRING(255),  // VARCHAR(255)
    unique: true,                 // UNIQUE constraint
    allowNull: false,            // NOT NULL constraint
    validate: {
      isEmail: true,              // Built-in validation to ensure the value is a valid email format
    },
  },
  
  // 'username' column with unique and not-null constraints
  username: {
    type: DataTypes.STRING(255),  // VARCHAR(255)
    unique: true,                 // UNIQUE constraint
    allowNull: false,            // NOT NULL constraint
  },
  
  // 'password' column with a NOT NULL constraint
  password: {
    type: DataTypes.STRING(255),  // VARCHAR(255)
    allowNull: false,            // NOT NULL constraint
  },
}, {
  // Additional table options (optional)
  tableName: 'users',          // Custom table name
  timestamps: false,           // Don't automatically add `createdAt` and `updatedAt`
});

// Export the model for use in other parts of your app
module.exports = User;