const {DataTypes}=require('sequelize')
const db=require("../config/db")
const User=require("./User")

const Blog=db.define('Blog',{

     // 'id' will be automatically added by default as an auto-incrementing primary key in Sequelize
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // Automatically incrementing ID
  },


    // 'title' 
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,            // NOT NULL constraint
  },
  
  // 'description' 
  description: {
    type: DataTypes.TEXT,  //Long description
    allowNull: false,            // NOT NULL constraint
  },
   user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,  // NOT NULL constraint for foreign key
    references: {
      model: User,      // Reference to the 'User' model
      key: 'id',        // The foreign key in 'users' model that corresponds to the 'id'
    },
  },
 
}, {
  // Additional table options (optional)
  tableName: 'blogs',          // Custom table name
  timestamps: false,           // Don't automatically add `createdAt` and `updatedAt`
});
Blog.belongsTo(User, { foreignKey: 'user_id' }); // Blog has a foreign key pointing to User
User.hasMany(Blog, { foreignKey: 'user_id' });  // User has many blogs

// Export the model for use in other parts of your app
module.exports = Blog;