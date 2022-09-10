const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/db");

const Character = sequelize.define(
  "Character",
  {
    name: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    image: {
      type: DataTypes.BLOB,
    },
    age: {
      type: DataTypes.INTEGER.UNSIGNED,
    },
    weight: {
      type: DataTypes.INTEGER.UNSIGNED,
    },
    history: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Character;
