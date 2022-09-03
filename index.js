//.env
require("dotenv").config();
//express
const express = require("express");
const app = express();

//initial rout
app.get("/", (req, res) => {
  res.send("Welcome to Disney API for Alkemy, by Diego Medina");
});

//server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
