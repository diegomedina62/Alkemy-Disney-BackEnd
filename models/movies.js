const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");

const Movies = sequelize.define(
  "Movie",
  {
    title: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    image: DataTypes.BLOB,
    filmDate: {
      type: DataTypes.DATEONLY,
      set(value) {
        //create date Object
        this.setDataValue("filmDate", new Date().setFullYear(value, 1, 1));
      },
      get() {
        if (!this.getDataValue("filmDate")) {
          return null;
        }
        const rawValue = new Date(this.getDataValue("filmDate"));
        return rawValue.getFullYear();
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      validate: {
        isIn: [[1, 2, 3, 4, 5]],
      },
    },
  },
  { timestamps: false }
);

module.exports = Movies;
