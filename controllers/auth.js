const { createCustomError } = require("../errors/custom-error");
const { StatusCodes } = require("http-status-codes");
const asyncWrapper = require("../middlewares/asyncWrapper");

//importing models
const User = require("../models/usersDatabase");
const sequelize = require("../database/db");

const register = asyncWrapper(async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw createCustomError("Missing fields", StatusCodes.BAD_REQUEST);
  }
  const result = await sequelize.transaction(async (t) => {
    const user = await User.create(req.body);
    const token = user.createJWT();
    return { user, token };
  });

  res
    .status(StatusCodes.CREATED)
    .json({ msg: "New user registered. Welcome!", result });
});

const login = (req, res) => {
  const loginInfo = req.body;
  res.json({ "Requested Route": "Login route", loginInfo });
};

module.exports = {
  register,
  login,
};
