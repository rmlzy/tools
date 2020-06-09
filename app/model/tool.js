"use strict";

const dayjs = require("dayjs");

module.exports = (app) => {
  const { INTEGER, STRING, DATE } = app.Sequelize;
  const Tool = app.model.define("Tool", {
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

    // 唯一的CODE
    code: {
      type: STRING(255),
      defaultValue: "",
      unique: true,
    },

    // 描述
    desc: {
      type: STRING(255),
      defaultValue: "",
    },

    // 状态
    status: {
      type: STRING(10),
      values: ["DONE", "WORKING", "DISABLED"],
      defaultValue: "DONE",
    },

    // 使用次数
    used: {
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
  return Tool;
};
