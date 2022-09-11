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
    return { token };
  });

  res
    .status(StatusCodes.CREATED)
    .json({ msg: "New user registered. Welcome!", result });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw createCustomError("Missing fields", StatusCodes.BAD_REQUEST);
  }
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw createCustomError("Invalid Email", StatusCodes.BAD_REQUEST);
  }

  const isValidPassword = user.checkPassword(password);
  if (!isValidPassword) {
    throw createCustomError("Invalid password", StatusCodes.BAD_REQUEST);
  }

  const token = user.createJWT();
  res.json({ msg: "Succesful Login", result: { token } });
});

module.exports = {
  register,
  login,
};
