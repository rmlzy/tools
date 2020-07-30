"use strict";

const dayjs = require("dayjs");

module.exports = (app) => {
  const { INTEGER, STRING, DATE, TEXT } = app.Sequelize;
  const Cheatsheet = app.model.define("Cheatsheet", {
    id: {
      type: INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },

    // 名称
    name: {
      type: STRING(100),
      defaultValue: "",
    },

    // 正文
    content: {
      type: TEXT('medium'),
      defaultValue: "",
    },

    // 描述
    desc: {
      type: STRING(255),
      defaultValue: "",
    },

    // 使用次数
    used: {
      type: INTEGER,
      defaultValue: 0,
    },

    // 状态
    status: {
      type: STRING(10),
      values: ["ENABLE", "DISABLE"],
      defaultValue: "ENABLE",
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
  return Cheatsheet;
};
