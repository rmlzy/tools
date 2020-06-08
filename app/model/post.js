"use strict";

const dayjs = require("dayjs");

module.exports = (app) => {
  const { INTEGER, STRING, DATE } = app.Sequelize;
  const Post = app.model.define("Post", {
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

    // 地址
    url: {
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
  return Post;
};
