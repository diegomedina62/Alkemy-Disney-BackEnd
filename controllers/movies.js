const { createCustomError } = require("../errors/custom-error");
const { StatusCodes } = require("http-status-codes");
const asyncWrapper = require("../middlewares/asyncWrapper");

//importing models
const Character = require("../models/characters");
const Movies = require("../models/movies");
const Gender = require("../models/gender");
const sequelize = require("../database/db");
8;
const getAllMovies = asyncWrapper(async (req, res, next) => {
  let searchOptions = { attributes: ["title", "image", "filmDate"] };
  const { title, order, queryGender } = req.query;
  if (title) {
    searchOptions.where = { title };
  }
  if (order) {
    searchOptions.order = [["filmDate", order]];
  }

  if (queryGender) {
    const gender = await Gender.findByPk(queryGender);
    if (!gender) {
      throw createCustomError("Gender doesn't exist", StatusCodes.BAD_REQUEST);
    }
    const result = (await gender.getMovies(searchOptions)).map((x) => {
      return { title: x.title, image: x.image, filmDate: x.filmDate };
    });
    return res.status(StatusCodes.OK).json({
      msg: "List of Movies",
      result,
      searchOptions,
    });
  }

  const result = await Movies.findAll(searchOptions);

  res
    .status(StatusCodes.OK)
    .json({ msg: "List of Movies", result, searchOptions });
});

const getMovie = asyncWrapper(async (req, res, next) => {
  const { title } = req.params;

  const movie = await Movies.findByPk(title);
  if (!movie) {
    throw createCustomError("Movie doesn't exist", StatusCodes.BAD_REQUEST);
  }

  const AssociatedCharaters = (
    await movie.getCharacters({ attributes: ["name"] })
  ).map((x) => x.name);
  const AssociatedGenders = (
    await movie.getGenders({
      attributes: ["gender"],
    })
  ).map((x) => x.gender);

  res.status(StatusCodes.OK).json({
    msg: "Movie Information",
    result: { movie, AssociatedCharaters, AssociatedGenders },
  });
});

const createMovie = asyncWrapper(async (req, res, next) => {
  const { associatedGender, associatedCharacter, ...movieData } = req.body;

  if (!movieData.title) {
    throw createCustomError(
      "Must provide Movie title",
      StatusCodes.BAD_REQUEST
    );
  }

  const result = await sequelize.transaction(async (t) => {
    const movie = await Movies.create(movieData, { transaction: t });
    let character = "";
    let charCreated = "";
    let gender = "";
    let genderCreated = "";
    if (associatedGender) {
      [gender, genderCreated] = await Gender.findOrCreate({
        where: { gender: associatedGender },
        transaction: t,
      });
      await movie.addGender(gender, { transaction: t });
    }
    if (associatedCharacter) {
      [character, charCreated] = await Character.findOrCreate({
        where: { name: associatedCharacter },
        transaction: t,
      });
      await movie.addCharacter(character, { transaction: t });
    }

    return { movie, character, charCreated, gender, genderCreated };
  });

  res.status(StatusCodes.OK).json({
    msg: "Create Movie",
    result,
  });
});

const updateMovie = asyncWrapper(async (req, res, next) => {
  const { title } = req.params;
  const { associatedGender, associatedCharacter, ...movieData } = req.body;

  let movie = await Movies.findByPk(title);
  if (!movie) {
    throw createCustomError(
      "Movie does not exist. Create one using createMovie",
      StatusCodes.BAD_REQUEST
    );
  }

  const result = await sequelize.transaction(async (t) => {
    let character = "";
    let charCreated = "";
    let gender = "";
    let genderCreated = "";
    if (associatedGender) {
      [gender, genderCreated] = await Gender.findOrCreate({
        where: { gender: associatedGender },
        transaction: t,
      });
      await movie.addGender(gender, { transaction: t });
    }
    if (associatedCharacter) {
      [character, charCreated] = await Character.findOrCreate({
        where: { name: associatedCharacter },
        transaction: t,
      });
      await movie.addCharacter(character, { transaction: t });
    }

    movie.set(movieData);
    movie = await movie.save({ transaction: t });

    return { movie, character, charCreated, gender, genderCreated };
  });

  res.status(StatusCodes.OK).json({ msg: "Movie Updated ", result });
});

const deleteMovie = asyncWrapper(async (req, res, next) => {
  const { title } = req.params;
  let movie = await Movies.findByPk(title);
  if (!movie) {
    throw createCustomError("Movie does not exist", StatusCodes.BAD_REQUEST);
  }

  await movie.destroy();

  res.status(StatusCodes.OK).json({ msg: `Movie Deleted: ${title}` });
});

module.exports = {
  getAllMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
};
