//.env
require("dotenv").config();
const Sequelize = require("sequelize");

const DBcreator = () => {
  const sequelize = new Sequelize(
    process.env.SQL_DATABASE,
    process.env.SQL_USERNAME,
    process.env.SQL_PASSWORD,
    {
      dialect: "mysql",
    }
  );

  const Character = require("./models/characters")(sequelize);
  const Movie = require("./models/movies")(sequelize);
  const Gender = require("./models/gender")(sequelize);
  const User = require("./models/usersDatabase")(sequelize);

  //definition of associations
  //Character to Movies in a M:N association
  Character.belongsToMany(Movie, { through: "Char-Movie" });
  Movie.belongsToMany(Character, { through: "Char-Movie" });

  //Movie to Gender in a M:N association
  Movie.belongsToMany(Gender, { through: "Movie-Gender" });
  Gender.belongsToMany(Movie, { through: "Movie-Gender" });

  return { Character, Movie, Gender, User, sequelize };
};

module.exports = DBcreator;
