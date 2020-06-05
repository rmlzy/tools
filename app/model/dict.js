"use strict";

module.exports = (app) => {
  const { INTEGER, STRING } = app.Sequelize;
  const Dict = app.model.define("Dict", {
    id: {
      type: INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },

    // 键
    key: {
      type: STRING(100),
      defaultValue: "",
      unique: true,
    },

    // 值
    value: {
      type: STRING(1000),
      defaultValue: "",
    },
  });
  return Dict;
};
