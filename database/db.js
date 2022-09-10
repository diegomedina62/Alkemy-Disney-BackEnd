//.env
require("dotenv").config();
const { Sequelize } = require("sequelize");

module.exports = new Sequelize(
  process.env.SQL_DATABASE,
  process.env.SQL_USERNAME,
  process.env.SQL_PASSWORD,
  {
    dialect: "mysql",
  }
);
