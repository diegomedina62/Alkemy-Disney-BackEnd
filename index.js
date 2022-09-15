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
const gendersRouter = require("./routes/gender");

//import middleware
const routeNotFound = require("./middlewares/notFound");
const errorHandlerMiddleware = require("./middlewares/errorHandler");
const authMiddleware = require("./middlewares/authentication");

//middlewares
app.use(express.json());

//initial route
app.get("/", (req, res) => {
  res.send("Welcome to Disney API for Alkemy, by Diego Medina");
});

//routes
app.use("/auth", authRouter);
app.use("/characters", authMiddleware, charactersRouter);
app.use("/movies", authMiddleware, moviesRouter);
app.use("/genders", authMiddleware, gendersRouter);

// error routes
app.use(routeNotFound);
app.use(errorHandlerMiddleware);

//server and SQL Connection using MySQL
const port = process.env.PORT || 3000;
const sequelize = require("./database/db");

(async () => {
  try {
    //chech SQL connection
    await sequelize.authenticate();
    console.log("Connection to MySQL has been stablished");
    //Sync Models
    require("./database/modelAssociations")();
    await sequelize.sync();
    console.log("Database has been synched");
    //set server
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
})();

module.exports = app; //for testing
