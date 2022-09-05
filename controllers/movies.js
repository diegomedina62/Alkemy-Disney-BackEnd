const getAllMovies = (req, res) => {
  res.send("get all movies");
};

const getMovie = (req, res) => {
  const { title } = req.params;
  res.send(`info about ${title}`);
};
const createMovie = (req, res) => {
  data = req.body;
  res.json({ "requested Route": "Create Movie", data });
};
const updateMovie = (req, res) => {
  const { title } = req.params;
  const data = req.body;
  res.send({ "Requested Route": `update ${title}`, data });
};
const deleteMovie = (req, res) => {
  const { title } = req.params;
  res.send(`delete ${title}`);
};

module.exports = {
  getAllMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
};
