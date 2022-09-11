const jwt = require("jsonwebtoken");
const { createCustomError } = require("../errors/custom-error");
const { StatusCodes } = require("http-status-codes");

const authenticationMiddleware = async (req, res, next) => {
  //check header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw createCustomError(
      "Invalid Authentication: please provide token",
      StatusCodes.UNAUTHORIZED
    );
  }
  //get token from header
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // add payload data to the req object
    req.userData = { userID: payload.userID, username: payload.username };
    next();
  } catch (error) {
    next(
      createCustomError(
        "Invalid Authentication:your token was not verified ",
        StatusCodes.UNAUTHORIZED
      )
    );
  }
};

module.exports = authenticationMiddleware;
