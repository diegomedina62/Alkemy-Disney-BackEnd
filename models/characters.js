const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
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
};
