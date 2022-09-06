const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  let responseError = {
    responseCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    responseMsg: err.message || "Internal Error: something went wrong",
  };

  return res
    .status(responseError.responseCode)
    .json({ message: responseError.responseMsg, rawError: err });
};

module.exports = errorHandlerMiddleware;
