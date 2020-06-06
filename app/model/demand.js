"use strict";

module.exports = (app) => {
  const { INTEGER, STRING } = app.Sequelize;
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
  });
  return Demand;
};
