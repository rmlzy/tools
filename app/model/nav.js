"use strict";

const dayjs = require("dayjs");

module.exports = (app) => {
  const { INTEGER, STRING, DATE } = app.Sequelize;
  const Nav = app.model.define("Nav", {
    id: {
      type: INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },

    // 网站名称
    name: {
      type: STRING(100),
      defaultValue: "",
    },

    // 网站地址
    url: {
      type: STRING(255),
      defaultValue: "",
      unique: true,
    },

    // 网站图标
    logo: {
      type: STRING(255),
      defaultValue: "",
    },

    // 网站描述
    desc: {
      type: STRING(255),
      defaultValue: "",
    },

    // 排序, 值越大越靠前
    sort: {
      type: INTEGER,
      defaultValue: 1,
    },

    // 点击数
    clicked: {
      type: INTEGER,
      defaultValue: 0,
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
  Nav.associate = function () {
    app.model.Nav.belongsTo(app.model.Category, { foreignKey: "categoryId" });
  };
  return Nav;
};
