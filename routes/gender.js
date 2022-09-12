const express = require("express");
const router = express.Router();

const {
  createGender,
  updateGender,
  deleteGender,
} = require("../controllers/gender");

router.route("/").post(createGender);
router.route("/:gender").put(updateGender).delete(deleteGender);

module.exports = router;
