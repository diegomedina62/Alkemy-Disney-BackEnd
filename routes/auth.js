const express = require("express");
const router = express.Router();

//import controllers
const { register, login, deleteUser } = require("../controllers/auth");
//Routes
router.post("/register", register);
router.post("/login", login);
router.delete("/delete/:email", deleteUser);

module.exports = router;
