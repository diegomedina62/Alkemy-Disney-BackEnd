const ModelsAssociations = () => {
  const Character = require("../models/characters");
  const Movie = require("../models/movies");
  const Gender = require("../models/gender");

  //definition of associations
  //Character to Movies in a M:N association
  Character.belongsToMany(Movie, { through: "Char-Movie" });
  Movie.belongsToMany(Character, { through: "Char-Movie" });

  //Movie to Gender in a M:N association
  Movie.belongsToMany(Gender, { through: "Movie-Gender" });
  Gender.belongsToMany(Movie, { through: "Movie-Gender" });
};

module.exports = ModelsAssociations;
