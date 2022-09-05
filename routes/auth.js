const express = require("express");
const router = express.Router();

//import controllers
const { register, login } = require("../controllers/auth");
//Routes
router.post("/register", register);
router.post("/login", login);

module.exports = router;
