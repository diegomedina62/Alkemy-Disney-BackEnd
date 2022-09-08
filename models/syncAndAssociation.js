module.exports = async (sequelize) => {
  //importing models to sync
  const Character = require("./characters")(sequelize);
  const Movie = require("./movies")(sequelize);
  const Gender = require("./gender")(sequelize);

  const User = require("./usersDatabase")(sequelize);

  //definition of associations
  //Character to Movies in a M:N association
  Character.belongsToMany(Movie, { through: "Char-Movie" });
  Movie.belongsToMany(Character, { through: "Char-Movie" });

  //Movie to Gender in a M:N association
  Movie.belongsToMany(Gender, { through: "Movie-Gender" });
  Gender.belongsToMany(Movie, { through: "Movie-Gender" });

  await sequelize.sync();
  console.log("Models have been synched");
};
