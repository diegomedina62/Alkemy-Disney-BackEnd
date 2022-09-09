const { Sequelize } = require("sequelize");
const { createCustomError } = require("../errors/custom-error");
const { StatusCodes } = require("http-status-codes");
const asyncWrapper = require("../middlewares/asyncWrapper");

//importing models
const DB = require("../SQLdatabase")();

//controllers
const getAllCharacters = (req, res) => {
  res.send("get all Characters");
};

const getCharacter = asyncWrapper((req, res, next) => {
  const { name } = req.params;
  res.send(`info about ${name}`);
});

const createCharacter = asyncWrapper(async (req, res, next) => {
  const { moviesAndSeries, ...characterData } = req.body;
  const character = await DB.Character.build(characterData);
  //case with input with no associated Movies
  if (!moviesAndSeries) {
    character.save();
    return res
      .status(StatusCodes.OK)
      .json({ "Character created": characterData });
  }

  //case with associated Movie
  const movie = await DB.Movie.findOne({ where: { title: moviesAndSeries } });
  if (!movie) {
    await character.save();
    await character.createMovie({ title: moviesAndSeries });
  } else {
    await character.save();
    await character.addMovie(movie);
  }
  res.status(StatusCodes.OK).send("Character created with movie added");
});

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
