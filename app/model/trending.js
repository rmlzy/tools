"use strict";

const dayjs = require("dayjs");

module.exports = (app) => {
  const { INTEGER, STRING, DATE, TEXT } = app.Sequelize;
  const Trending = app.model.define("Trending", {
    id: {
      type: INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },

    // 日期
    date: {
      type: STRING(100),
      defaultValue: "",
    },

    // 类型, repositories: 仓库, developers: 开发者
    type: {
      type: STRING(30),
      values: ["repositories", "developers"],
      defaultValue: "repositories",
    },

    // 语言
    language: {
      type: STRING(100),
      defaultValue: "",
    },

    // 可读的语言
    humanLanguage: {
      type: STRING(100),
      defaultValue: "",
    },

    // Date Range
    since: {
      type: STRING(10),
      values: ["daily", "weekly", "monthly"],
      defaultValue: "daily",
    },

    // 内容
    json: {
      type: TEXT,
      defaultValue: '',
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
  return Trending;
};
