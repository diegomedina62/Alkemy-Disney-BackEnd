const chaiHttp = require("chai-http");
const chai = require("chai");
const { assert } = require("chai");
const server = require("../index");
const { suite, test } = require("mocha");
const { StatusCodes } = require("http-status-codes");

chai.use(chaiHttp);

suite("Movies Routes", function () {
  const bodyRequest = {
    username: "testUser",
    email: "sven64@ethereal.email", //will be removed from database at the end of test
    password: "secret",
  };
  let token;
  const TestCharacter = "TestCharacter";
  const TestMovie = "TestMovie";
  const TestGender = "TestGender";

  const characterBody = {
    title: "TestMovie",
    image: "imagenExample",
    rating: 2,
    filmDate: 2008,
    associatedCharacter: "Hulk",
    associatedGender: "Fanstasy",
  };
  before((done) => {
    chai
      .request(server)
      .post("/auth/register")
      .send(bodyRequest)
      .end((err, res) => {
        token = res.body.result.token;

        done();
      });
  });

  suite("Create Movies ", function () {
    test("create movie with missing title", function (done) {
      chai
        .request(server)
        .post("/movies")
        .set({ Authorization: `Bearer ${token}` })
        .send({})
        .end((err, res) => {
          assert.equal(res.status, StatusCodes.BAD_REQUEST);
          assert.equal(res.body.error.message, "Must provide Movie title");
          done();
        });
    });
    test("create movie with wrong dataType", function (done) {
      chai
        .request(server)
        .post("/movies")
        .set({ Authorization: `Bearer ${token}` })
        .send({
          title: "TestMovie",
          image: "imagenExample",
          rating: "Wrong",
          filmDate: "Wrong",
          associatedCharacter: "Hulk",
          associatedGender: "Fanstasy",
        })
        .end((err, res) => {
          assert.equal(res.status, StatusCodes.BAD_REQUEST);
          assert.hasAllKeys(res.body, ["error"]);
          done();
        });
    });
    test("Succesfuly Create Movie", function (done) {
      chai
        .request(server)
        .post("/movies")
        .set({ Authorization: `Bearer ${token}` })
        .send({
          title: TestMovie,
          image: "imagenExample",
          rating: 1,
          filmDate: 2001,
          associatedCharacter: TestCharacter,
          associatedGender: TestGender,
        })
        .end((err, res) => {
          assert.equal(res.status, StatusCodes.OK);
          assert.hasAllKeys(res.body.result, [
            "movie",
            "character",
            "charCreated",
            "gender",
            "genderCreated",
          ]);
          done();
        });
    });
  });

  suite("Update Character", function () {
    test("Update nonexistent Movie", function (done) {
      chai
        .request(server)
        .put("/movies/nonExistent")
        .set({ Authorization: `Bearer ${token}` })
        .send({})
        .end((err, res) => {
          assert.equal(res.status, StatusCodes.BAD_REQUEST);
          assert.equal(
            res.body.error.message,
            "Movie does not exist. Create one using createMovie"
          );
          done();
        });
    });
    test("Update Movie with wrong DataType", function (done) {
      chai
        .request(server)
        .put(`/movies/${TestMovie}`)
        .set({ Authorization: `Bearer ${token}` })
        .send({
          image: "imagenExample",
          rating: "wrong",
          filmDate: "wrong",
          associatedCharacter: TestCharacter,
          associatedGender: TestGender,
        })
        .end((err, res) => {
          assert.equal(res.status, StatusCodes.BAD_REQUEST);
          assert.hasAllKeys(res.body.error, ["message"]);
          done();
        });
    });
    test("Succesfully Update Movie", function (done) {
      chai
        .request(server)
        .put(`/movies/${TestMovie}`)
        .set({ Authorization: `Bearer ${token}` })
        .send({
          image: "imagenExample",
          rating: 2,
          filmDate: 2002,
          associatedCharacter: TestCharacter,
          associatedGender: TestGender,
        })
        .end((err, res) => {
          assert.equal(res.status, StatusCodes.OK);
          assert.hasAllKeys(res.body.result, [
            "movie",
            "character",
            "charCreated",
            "gender",
            "genderCreated",
          ]);
          done();
        });
    });
  });
  suite("Get All Movies", function () {
    test("Get all Movies with no query params", function (done) {
      chai
        .request(server)
        .get(`/movies`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          assert.equal(res.status, StatusCodes.OK);
          assert.isArray(res.body.result);
          assert.hasAllKeys(res.body, ["msg", "result", "searchOptions"]);
          done();
        });
    });
    test("Get all Movies with query Params", function (done) {
      chai
        .request(server)
        .get(`/movies?order=desc&title=${TestMovie}&queryGender=${TestGender}`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          assert.equal(res.status, StatusCodes.OK);
          assert.isArray(res.body.result);
          assert.equal(res.body.result[0].title, TestMovie);
          console.log(res.body);
          done();
        });
    });
    test("Get all with with nonexistent Gender", function (done) {
      chai
        .request(server)
        .get(`/movies?queryGender=UnexistentGender`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          assert.equal(res.status, StatusCodes.BAD_REQUEST);
          assert.equal(res.body.error.message, "Gender doesn't exist");
          done();
        });
    });
  });
  suite("get One Movie", function () {
    test("Get one Movie by title", function (done) {
      chai
        .request(server)
        .get(`/movies/${TestMovie}`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          assert.equal(res.status, StatusCodes.OK);
          assert.hasAllKeys(res.body.result, [
            "movie",
            "AssociatedCharaters",
            "AssociatedGenders",
          ]);
          assert.equal(res.body.result.movie.title, TestMovie);
          done();
        });
    });
    test("try to get unexistent movie", function (done) {
      chai
        .request(server)
        .get(`/movies/Unexistent`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          assert.equal(res.status, StatusCodes.BAD_REQUEST);
          assert.equal(res.body.error.message, "Movie doesn't exist");
          done();
        });
    });
  });

  suite("Delete Movie", function () {
    test("Try to Delete nonexistent Character", function (done) {
      chai
        .request(server)
        .delete("/movies/Nonexistent")
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          assert.equal(res.status, StatusCodes.BAD_REQUEST);
          assert.equal(res.body.error.message, "Movie does not exist");
          done();
        });
    });
    test("Succesfully delete movie", function (done) {
      chai
        .request(server)
        .delete(`/movies/${TestMovie}`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          assert.equal(res.status, StatusCodes.OK);
          assert.hasAllKeys(res.body, ["msg"]);
          done();
        });
    });
  });
  after((done) => {
    chai
      .request(server)
      .delete(`/genders/${TestGender}`)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        done();
      });
  });
  after((done) => {
    chai
      .request(server)
      .delete(`/characters/${TestCharacter}`)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        done();
      });
  });

  after((done) => {
    chai
      .request(server)
      .delete(`/auth/delete/${bodyRequest.email}`)
      .end((err, res) => {
        done();
      });
  });
});
