"use strict";

const dayjs = require("dayjs");

module.exports = (app) => {
  const { INTEGER, STRING, DATE } = app.Sequelize;
  const Demand = app.model.define("Demand", {
    id: {
      type: INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },

    username: {
      type: STRING(100),
      defaultValue: "",
    },

    status: {
      type: STRING(10),
      values: ["DONE", "WORKING", "REJECT"],
      defaultValue: "DONE",
    },

    email: {
      type: STRING(100),
      defaultValue: "",
    },

    content: {
      type: STRING(1000),
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
  return Demand;
};
