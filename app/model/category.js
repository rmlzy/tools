"use strict";

const dayjs = require("dayjs");

module.exports = (app) => {
  const { INTEGER, STRING, DATE } = app.Sequelize;
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

    createdAt: {
      type: DATE,
      get() {
        const createdAt = this.getDataValue("createdAt");
        return dayjs(createdAt).format("YYYY-MM-DD HH:mm:ss");
      },
    },

    updatedAt: {
      type: DATE,
      get() {
        const updatedAt = this.getDataValue("updatedAt");
        return dayjs(updatedAt).format("YYYY-MM-DD HH:mm:ss");
      },
    },
  });
  Category.associate = function () {
    app.model.Category.hasMany(app.model.Nav, { foreignKey: "categoryId" });
  };
  return Category;
};
