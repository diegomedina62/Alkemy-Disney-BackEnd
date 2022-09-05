const getAllMovies = (req, res) => {
  res.send("get all movies");
};

const getMovie = (req, res) => {
  const { title } = req.params;
  res.send(`info about ${title}`);
};
const createMovie = (req, res) => {
  res.send("create movie");
};
const updateMovie = (req, res) => {
  const { title } = req.params;
  res.send(`update ${title}`);
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
