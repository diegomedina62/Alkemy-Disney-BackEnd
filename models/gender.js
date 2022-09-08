const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
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
};
