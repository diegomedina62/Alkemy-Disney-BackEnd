const { Op } = require("sequelize");
const { createCustomError } = require("../errors/custom-error");
const { StatusCodes } = require("http-status-codes");
const asyncWrapper = require("../middlewares/asyncWrapper");

//importing models

const Character = require("../models/characters");
const Movies = require("../models/movies");
const sequelize = require("../database/db");

//controllers
const getAllCharacters = asyncWrapper(async (req, res) => {
  let queryArray = [];
  const { name, age, movie } = req.query;
  if (name) {
    queryArray.push({ name });
  }
  if (age) {
    queryArray.push({ age });
  }
  // if (movie) {
  //   queryObject.movie = movie;
  // }
  const result = await Character.findAll({
    attributes: ["name", "image"],
    where: { [Op.or]: queryArray },
  });
  res.json({ msg: "List of Characters", queryArray, result });
});

const getCharacter = asyncWrapper(async (req, res, next) => {
  const { name } = req.params;

  res.json({ msg: "Character created" });
});

const createCharacter = asyncWrapper(async (req, res, next) => {
  const { moviesAndSeries, ...characterData } = req.body;

  const result = await sequelize.transaction(async (t) => {
    const character = await Character.create(characterData, { transaction: t });
    let movie = "";
    let created = "";
    if (moviesAndSeries) {
      [movie, created] = await Movies.findOrCreate({
        where: { title: moviesAndSeries },
        transaction: t,
      });
      await character.addMovie(movie, { transaction: t });
    }
    return { character, movie, created };
  });

  res.status(StatusCodes.OK).json({ msg: "Character Created", result });
});

const updateCharacter = asyncWrapper(async (req, res, next) => {
  const { name } = req.params;
  const { moviesAndSeries, ...characterData } = req.body;

  let character = await Character.findByPk(name);
  if (!character) {
    throw createCustomError(
      "Character does not exist. Create one using createCharacter"
    );
  }
  const result = await sequelize.transaction(async (t) => {
    let movie = "";
    let created = "";
    if (moviesAndSeries) {
      [movie, created] = await Movies.findOrCreate({
        where: { title: moviesAndSeries },
        transaction: t,
      });
      await character.addMovie(movie, { transaction: t });
    }
    character.set(characterData);
    character = await character.save({ transaction: t });
    return { character, movie, created };
  });

  res.status(StatusCodes.OK).json({ msg: "Character Updated", result });
});

const deleteCharacter = asyncWrapper(async (req, res) => {
  const { name } = req.params;
  let character = await Character.findByPk(name);
  if (!character) {
    throw createCustomError("Character does not exist.");
  }

  await character.destroy();

  res.status(StatusCodes.OK).json({ msg: `Character Deleted: ${name}` });
});

module.exports = {
  getAllCharacters,
  getCharacter,
  createCharacter,
  updateCharacter,
  deleteCharacter,
};
