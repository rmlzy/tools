"use strict";

const dayjs = require("dayjs");

module.exports = (app) => {
  const { INTEGER, STRING, DATE } = app.Sequelize;
  const Comment = app.model.define("Comment", {
    id: {
      type: INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },

    // 页面地址
    page: {
      type: STRING(255),
      defaultValue: "",
      allowNull: false,
    },

    // 评论人
    username: {
      type: STRING(100),
      defaultValue: "",
    },

    // 评论人网站
    website: {
      type: STRING(255),
      defaultValue: "",
    },

    // 评论人邮箱
    email: {
      type: STRING(255),
      defaultValue: "",
    },

    // 是否接受邮箱推送
    receiveNotify: {
      type: STRING(10),
      values: ["ENABLE", "DISABLE"],
      defaultValue: "ENABLE",
    },

    // 评论正文
    content: {
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
  return Comment;
};
