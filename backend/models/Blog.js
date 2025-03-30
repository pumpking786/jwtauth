const { DataTypes } = require("sequelize");
const { defaultValueSchemable } = require("sequelize/lib/utils");

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
      writer: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      time: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
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
