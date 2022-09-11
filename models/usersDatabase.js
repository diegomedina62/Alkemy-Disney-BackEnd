const { DataTypes, Model } = require("sequelize");
const sequelize = require("../database/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class User extends Model {
  createJWT() {
    return jwt.sign(
      { userID: this.id, username: this.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_LIFETIME }
    );
  }
}
User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(password) {
        //password encryptation
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        this.setDataValue("password", hashedPassword);
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { isEmail: true },
    },
  },
  {
    sequelize,
  }
);

module.exports = User;
