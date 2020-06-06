"use strict";

module.exports = (app) => {
  const { INTEGER, STRING } = app.Sequelize;
  const Tool = app.model.define("Tool", {
    id: {
      type: INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },

    name: {
      type: STRING(100),
      defaultValue: "",
    },

    url: {
      type: STRING(100),
      defaultValue: "",
      unique: true,
    },

    desc: {
      type: STRING(255),
      defaultValue: "",
    },

    status: {
      type: STRING(10),
      values: ["DONE", "WORKING", "DISABLED"],
      defaultValue: "DONE",
    },

    used: {
      type: INTEGER,
      defaultValue: 0,
    },
  });
  return Tool;
};
