//.env
require("dotenv").config();
//express
const express = require("express");
const app = express();

//import routers
const authRouter = require("./routes/auth");
const charactersRouter = require("./routes/characters");
const moviesRouter = require("./routes/movies");

//initial route
app.get("/", (req, res) => {
  res.send("Welcome to Disney API for Alkemy, by Diego Medina");
});

//routes
app.use("/auth", authRouter);
app.use("/characters", charactersRouter);
app.use("/movies", moviesRouter);

//server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
