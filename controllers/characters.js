const { createCustomError } = require("../errors/custom-error");
const { StatusCodes } = require("http-status-codes");
const asyncWrapper = require("../middlewares/asyncWrapper");

//importing models

const Character = require("../models/characters");
const Movies = require("../models/movies");
const sequelize = require("../database/db");

//controllers
const getAllCharacters = (req, res) => {
  res.send("get all Characters");
};

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
