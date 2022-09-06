//.env
require("dotenv").config();
//express
const express = require("express");
const app = express();

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

//server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
