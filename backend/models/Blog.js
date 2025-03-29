const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Blog = sequelize.define(
    "Blog",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // This should be the table name, not the model itself
          key: "id",
        },
      },
    },
    {
      tableName: "blogs",
      timestamps: false,
    }
  );
  // ✅ Define Associations
  Blog.associate = (models) => {
    Blog.belongsTo(models.User, { foreignKey: "user_id" });
  };
  return Blog;
};
