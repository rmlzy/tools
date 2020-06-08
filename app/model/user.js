"use strict";

const dayjs = require("dayjs");

module.exports = (app) => {
  const { INTEGER, STRING, DATE } = app.Sequelize;
  const User = app.model.define("User", {
    id: {
      type: INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },

    // 邮箱, 用于登录
    email: {
      type: STRING(100),
      allowNull: false,
      unique: true,
    },

    // 密码, 用于登录
    password: {
      type: STRING(50),
      defaultValue: "",
    },

    // 用户等级
    level: {
      type: STRING(10),
      values: ["USER", "ADMIN"],
      defaultValue: "USER",
    },

    // 用户昵称
    nickname: {
      type: STRING(20),
      defaultValue: "",
    },

    // 头像地址
    avatar: {
      type: STRING(500),
      defaultValue: "",
    },

    // 状态, DISABLE: 停用, ENABLE: 启用
    status: {
      type: STRING(20),
      defaultValue: "ENABLE",
    },

    // 用户认证信息
    token: {
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
  return User;
};
