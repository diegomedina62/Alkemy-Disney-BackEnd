const getAllCharacters = (req, res) => {
  res.send("get all Characters");
};

const getCharacter = (req, res) => {
  const { name } = req.params;
  res.send(`info about ${name}`);
};
const createCharacter = (req, res) => {
  res.send("create Character");
};
const updateCharacter = (req, res) => {
  const { name } = req.params;
  res.send(`update ${name}`);
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
