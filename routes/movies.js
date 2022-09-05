const express = require("express");
const router = express.Router();

const {
  getAllMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
} = require("../controllers/movies");

router.route("/").get(getAllMovies).post(createMovie);
router.route("/:title").get(getMovie).put(updateMovie).delete(deleteMovie);

module.exports = router;
