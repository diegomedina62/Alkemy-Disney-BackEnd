const express = require("express");
const router = express.Router();

const {
  getAllCharacters,
  getCharacter,
  createCharacter,
  updateCharacter,
  deleteCharacter,
} = require("../controllers/characters");

router.route("/").get(getAllCharacters).post(createCharacter);
router
  .route("/:name")
  .get(getCharacter)
  .put(updateCharacter)
  .delete(deleteCharacter);

module.exports = router;
