const getAllCharacters = (req, res) => {
  res.send("get all Characters");
};

const getCharacter = (req, res) => {
  const { name } = req.params;
  res.send(`info about ${name}`);
};
const createCharacter = (req, res) => {
  const data = req.body;
  res.json({ "Requested Route": "create Character", data });
};
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
