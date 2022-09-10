const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/db");

const Gender = sequelize.define(
  "Gender",
  {
    gender: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    image: {
      type: DataTypes.BLOB,
    },
  },
  { timestamps: false }
);

module.exports = Gender;
