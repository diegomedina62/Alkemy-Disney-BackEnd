//.env
require("dotenv").config();
//express
const express = require("express");
const app = express();
//from dependencies
const { Sequelize } = require("sequelize");

//import routers
const authRouter = require("./routes/auth");
const charactersRouter = require("./routes/characters");
const moviesRouter = require("./routes/movies");

//import middleware
const routeNotFound = require("./middlewares/notFound");
const errorHandlerMiddleware = require("./middlewares/errorHandler");

//middlewares
app.use(express.json());

//initial route
app.get("/", (req, res) => {
  res.send("Welcome to Disney API for Alkemy, by Diego Medina");
});

//routes
app.use("/auth", authRouter);
app.use("/characters", charactersRouter);
app.use("/movies", moviesRouter);

app.use(routeNotFound);
app.use(errorHandlerMiddleware);

//server and SQL Connection using MySQL
const port = process.env.PORT || 3000;
const sequelize = new Sequelize(
  process.env.SQL_DATABASE,
  process.env.SQL_USERNAME,
  process.env.SQL_PASSWORD,
  {
    dialect: "mysql",
  }
);
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to MySQL has been stablished");

    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
})();
