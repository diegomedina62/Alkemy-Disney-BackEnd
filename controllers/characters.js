const { createCustomError } = require("../errors/custom-error");
const { StatusCodes } = require("http-status-codes");
const asyncWrapper = require("../middlewares/asyncWrapper");

const getAllCharacters = (req, res) => {
  res.send("get all Characters");
};

const getCharacter = asyncWrapper((req, res, next) => {
  const { name } = req.params;
  if (name == "error") {
    throw createCustomError(
      "Error Test/prueba de error",
      StatusCodes.IM_A_TEAPOT
    );
  }
  res.send(`info about ${name}`);
});

const createCharacter = (req, res) => {
  const data = req.body;
  res.json({ "Requested Route": "create Character", data });
};
const updateCharacter = (req, res) => {
  const { name } = req.params;
  const data = req.body;
  res.json({ "Requested Route": `update ${name}`, data });
};
const deleteCharacter = (req, res) => {
  const { name } = req.params;
  res.send(`Delete ${name}`);
};

module.exports = {
  getAllCharacters,
  getCharacter,
  createCharacter,
  updateCharacter,
  deleteCharacter,
};
