const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "Movie",
    {
      title: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      imagen: DataTypes.BLOB,
      fecha: DataTypes.DATE,
      rating: {
        type: DataTypes.INTEGER,
        validate: {
          isIn: [[1, 2, 3, 4, 5]],
        },
      },
    },
    { timestamps: false }
  );
};
