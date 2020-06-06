"use strict";

module.exports = (app) => {
  const { INTEGER, STRING } = app.Sequelize;
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
  });
  return Comment;
};
