const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  let responseError = {
    responseCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    responseMsg: err.message || "Internal Error: something went wrong",
  };

  if (err.name == "SequelizeUniqueConstraintError") {
    responseError.responseCode = StatusCodes.BAD_REQUEST;
    responseError.responseMsg = err.errors.map((x) => x.message);
  }
  if (err.name == "SequelizeValidationError") {
    responseError.responseCode = StatusCodes.BAD_REQUEST;
    responseError.responseMsg = err.errors.map((x) => x.message);
  }
  if (err.name == "SequelizeDatabaseError") {
    responseError.responseCode = StatusCodes.BAD_REQUEST;
    responseError.responseMsg = err.message;
  }

  return res.status(responseError.responseCode).json({
    error: { message: responseError.responseMsg },
  });
};

module.exports = errorHandlerMiddleware;
