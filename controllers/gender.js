const { createCustomError } = require("../errors/custom-error");
const { StatusCodes } = require("http-status-codes");
const asyncWrapper = require("../middlewares/asyncWrapper");

//importing models

const Gender = require("../models/gender");
const sequelize = require("../database/db");

const createGender = asyncWrapper(async (req, res, next) => {
  result = sequelize.transaction(async (t) => {
    const gender = await Gender.create(req.body, { transaction: t });
    return gender;
  });

  res.status(StatusCodes.OK).json({ msg: "Gender created", result });
});
const updateGender = asyncWrapper(async (req, res, next) => {
  const { gender } = req.params;
  let genderInstance = await Gender.findByPk(gender);
  if (!genderInstance) {
    throw createCustomError("Gender doesn't exist", StatusCodes.BAD_REQUEST);
  }
  result = await sequelize.transaction(async (t) => {
    genderInstance.set(req.body);
    genderInstance = await genderInstance.save({ transaction: t });
    return { genderInstance };
  });

  res.status(StatusCodes.OK).json({ msg: "Gender updated", result });
});
const deleteGender = asyncWrapper(async (req, res, next) => {
  const { gender } = req.params;
  let genderInstance = await Gender.findByPk(gender);
  if (!genderInstance) {
    throw createCustomError("Gender doesn't exist", StatusCodes.BAD_REQUEST);
  }

  await genderInstance.destroy();
  res.status(StatusCodes.OK).json({ msg: `Gender deleted:${gender}` });
});

module.exports = { createGender, updateGender, deleteGender };
