"use strict";

module.exports = (app) => {
  const { INTEGER, STRING } = app.Sequelize;
  const Category = app.model.define("Category", {
    id: {
      type: INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },

    // 分类名称
    name: {
      type: STRING(100),
      defaultValue: "",
      unique: true,
    },

    // 分类描述
    desc: {
      type: STRING(255),
      defaultValue: "",
    },
  });
  Category.associate = function () {
    app.model.Category.hasMany(app.model.Nav, { foreignKey: "categoryId" });
  };
  return Category;
};
