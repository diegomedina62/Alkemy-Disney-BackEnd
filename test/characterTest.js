const chaiHttp = require("chai-http");
const chai = require("chai");
const { assert } = require("chai");
const server = require("../index");
const { suite, test } = require("mocha");
const { StatusCodes } = require("http-status-codes");

chai.use(chaiHttp);

suite("Character Routes", function () {
  const bodyRequest = {
    username: "testUser",
    email: "sven64@ethereal.email", //will be removed from database at the end of test
    password: "secret",
  };
  let token;
  const TestCharacter = "TestCharacter";
  const TestMovie = "TestMovie";

  const characterBody = {
    name: "Dr.Strange",
    image: "blobexample",
    age: 90,
    weight: 150,
    history: "Character History",
    moviesAndSeries: "Ironman2",
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

  suite("Create Character tests", function () {
    test("Create Character with missing name", function (done) {
      chai
        .request(server)
        .post("/characters")
        .set({ Authorization: `Bearer ${token}` })
        .send({}) //missing name
        .end((err, res) => {
          assert.equal(res.status, StatusCodes.BAD_REQUEST);
          assert.equal(res.body.error.message, "Must provide Character name");
          done();
        });
    });
    test("Create character with wrong dataType", function (done) {
      chai
        .request(server)
        .post("/characters")
        .set({ Authorization: `Bearer ${token}` })
        .send({
          name: "Dr.Strange",
          image: "blobexample",
          age: "abc",
          weight: "abc",
          history: "Character History",
          moviesAndSeries: "Ironman2",
        }) //wrong dataType
        .end((err, res) => {
          assert.equal(res.status, StatusCodes.BAD_REQUEST);
          assert.hasAllKeys(res.body, ["error"]);
          done();
        });
    });
    test("Succesfuly Create Character", function (done) {
      chai
        .request(server)
        .post("/characters")
        .set({ Authorization: `Bearer ${token}` })
        .send({
          name: TestCharacter,
          image: "blobexample",
          age: 1,
          weight: 1,
          history: "Test History",
          moviesAndSeries: TestMovie,
        })
        .end((err, res) => {
          assert.equal(res.status, StatusCodes.OK);
          assert.hasAllKeys(res.body.result, ["character", "movie", "created"]);
          done();
        });
    });
  });

  suite("Update Character test ", function () {
    test("Update nonexistent Character", function (done) {
      chai
        .request(server)
        .put("/characters/nonExistent")
        .set({ Authorization: `Bearer ${token}` })
        .send({
          image: "blobexample",
          age: 1,
          weight: 1,
          history: "Test History",
          moviesAndSeries: TestMovie,
        })
        .end((err, res) => {
          assert.equal(res.status, StatusCodes.BAD_REQUEST);
          assert.equal(
            res.body.error.message,
            "Character does not exist. Create one using createCharacter"
          );
          done();
        });
    });
    test("Update Character with wrong datatype", function (done) {
      chai
        .request(server)
        .put(`/characters/${TestCharacter}`)
        .set({ Authorization: `Bearer ${token}` })
        .send({
          image: "blobexample",
          age: "Wrong",
          weight: "Wrong",
          history: "Update",
          moviesAndSeries: TestMovie,
        }) //wrong dataType
        .end((err, res) => {
          assert.equal(res.status, StatusCodes.BAD_REQUEST);
          assert.hasAllKeys(res.body, ["error"]);
          done();
        });
    });
    test("Succesfully Update Character", function (done) {
      chai
        .request(server)
        .put(`/characters/${TestCharacter}`)
        .set({ Authorization: `Bearer ${token}` })
        .send({
          image: "blobexample",
          age: 2,
          weight: 2,
          history: "Update",
          moviesAndSeries: TestMovie,
        })
        .end((err, res) => {
          assert.equal(res.status, StatusCodes.OK);
          assert.hasAllKeys(res.body.result, ["character", "movie", "created"]);
          done();
        });
    });
  });
  suite("Get All Character test ", function () {
    test("Get all character with no query params", function (done) {
      chai
        .request(server)
        .get(`/characters`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          assert.equal(res.status, StatusCodes.OK);
          assert.isArray(res.body.result);
          assert.hasAllKeys(res.body, ["msg", "result", "queryArray"]);
          done();
        });
    });
    test("Get all character with query Params", function (done) {
      chai
        .request(server)
        .get(
          `/characters?name=${TestCharacter}&age=${2}&queryMovie=${TestMovie}`
        )
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          assert.equal(res.status, StatusCodes.OK);
          assert.isArray(res.body.result);
          assert.equal(res.body.result[0].name, TestCharacter);
          done();
        });
    });
    test("Get all character with nonexistent movie", function (done) {
      chai
        .request(server)
        .get(`/characters?queryMovie=UnexistentMovie`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          assert.equal(res.status, StatusCodes.BAD_REQUEST);
          assert.equal(res.body.error.message, "Movie doesn't exist");
          done();
        });
    });
  });
  suite("Get One Character test ", function () {
    test("Get one character by name", function (done) {
      chai
        .request(server)
        .get(`/characters/${TestCharacter}`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          assert.equal(res.status, StatusCodes.OK);
          assert.hasAllKeys(res.body.result, ["character", "AssociatedMovies"]);
          assert.equal(res.body.result.character.name, TestCharacter);
          done();
        });
    });
    test("Try to get nonexistent Character", function (done) {
      chai
        .request(server)
        .get("/characters/Nonexistent")
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          assert.equal(res.status, StatusCodes.BAD_REQUEST);
          assert.equal(res.body.error.message, "Character doesn't exist");
          done();
        });
    });
  });
  suite("delete Character ", function () {
    test("Try to Delete nonexistent Character", function (done) {
      chai
        .request(server)
        .delete("/characters/Nonexistent")
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          assert.equal(res.status, StatusCodes.BAD_REQUEST);
          assert.equal(res.body.error.message, "Character does not exist.");
          done();
        });
    });
    test("Succesfully delete Character", function (done) {
      chai
        .request(server)
        .delete(`/characters/${TestCharacter}`)
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
      .delete(`/movies/${TestMovie}`)
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
