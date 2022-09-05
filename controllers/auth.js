const register = (req, res) => {
  const registerInfo = req.body;
  res.json({ "Requested Route": "Register route", registerInfo });
};

const login = (req, res) => {
  const loginInfo = req.body;
  res.json({ "Requested Route": "Login route", loginInfo });
};

module.exports = {
  register,
  login,
};
