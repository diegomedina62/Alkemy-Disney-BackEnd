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
    const user = await User.create(req.body, { transaction: t });
    const token = user.createJWT();
    return { token };
  });

  const wasWelcomeEmailSent = await require("../controllers/emailSender")(
    email,
    username
  );

  res.status(StatusCodes.CREATED).json({
    msg: "New user registered. Welcome!",
    result,
    wasWelcomeEmailSent,
  });
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
  res
    .status(StatusCodes.OK)
    .json({ msg: "Succesful Login", result: { token } });
});

const deleteUser = asyncWrapper(async (req, res, next) => {
  const { email } = req.params;
  let user = await User.findOne({ where: { email } });
  if (!user) {
    throw createCustomError("User doesn't exist", StatusCodes.BAD_REQUEST);
  }

  await user.destroy();
  res.status(StatusCodes.OK).json({ msg: `User deleted:${email}` });
});

module.exports = {
  register,
  login,
  deleteUser,
};
