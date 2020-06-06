"use strict";

module.exports = (app) => {
  const { INTEGER, STRING } = app.Sequelize;
  const Nav = app.model.define("Nav", {
    id: {
      type: INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },

    // 网站名称
    title: {
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
  });
  Nav.associate = function () {
    app.model.Nav.belongsTo(app.model.Category, { foreignKey: "categoryId" });
  };
  return Nav;
};
