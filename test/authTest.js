const chaiHttp = require("chai-http");
const chai = require("chai");
const { assert } = require("chai");
const server = require("../index");
const { suite, test } = require("mocha");
const { StatusCodes } = require("http-status-codes");

chai.use(chaiHttp);

suite("Auth Routes", function () {
  const bodyRequest = {
    username: "testUser",
    email: "sven64@ethereal.email", //will be removed from database at the end of test
    password: "secret",
  };

  suite("Register rout test", function () {
    test("Register with missing register values", function (done) {
      chai
        .request(server)
        .post("/auth/register")
        .send({}) //missing values
        .end((err, res) => {
          assert.equal(res.status, StatusCodes.BAD_REQUEST);
          assert.hasAllKeys(res.body.error, { message: "Missing fields" });
          done();
        });
    });
    test("Register with Invalid Mail", function (done) {
      chai
        .request(server)
        .post("/auth/register")
        .send({
          username: "diego",
          email: "diegofakeemail.com", //invalid email
          password: "secret",
        })
        .end((err, res) => {
          assert.equal(res.status, StatusCodes.BAD_REQUEST);
          assert.hasAllKeys(res.body.error, {
            message:
              "Validation error: your email does not have a valid email format",
          });
          done();
        });
    });
    test("Succesfull Register", function (done) {
      chai
        .request(server)
        .post("/auth/register")
        .send(bodyRequest)
        .end((err, res) => {
          assert.equal(res.status, StatusCodes.CREATED);
          assert.hasAllKeys(res.body, ["msg", "result", "wasWelcomeEmailSent"]);
          done();
        });
    });
    test("try to register a repeated Email", function (done) {
      chai
        .request(server)
        .post("/auth/register")
        .send(bodyRequest)
        .end((err, res) => {
          assert.equal(res.status, StatusCodes.BAD_REQUEST);
          assert.hasAllKeys(res.body, ["error"]);
          done();
        });
    });
  });

  suite("Login Routes", function () {
    test("Succesful Login", function (done) {
      chai
        .request(server)
        .post("/auth/login")
        .send(bodyRequest)
        .end((err, res) => {
          assert.equal(res.status, StatusCodes.OK);
          assert.hasAllKeys(res.body.result, ["token"]);
          done();
        });
    });
    test("Login with invalid password", function (done) {
      chai
        .request(server)
        .post("/auth/login")
        .send({ email: bodyRequest.email, password: "WrongPassword" })
        .end((err, res) => {
          assert.equal(res.status, StatusCodes.BAD_REQUEST);
          assert.hasAllKeys(res.body, ["error"]);
          assert.equal(res.body.error.message, "Invalid password");
          done();
        });
    });
    test("Login with invalid email", function (done) {
      chai
        .request(server)
        .post("/auth/login")
        .send({ email: "invalidEmail", password: "WrongPassword" })
        .end((err, res) => {
          assert.equal(res.status, StatusCodes.BAD_REQUEST);
          assert.hasAllKeys(res.body, ["error"]);
          assert.equal(res.body.error.message, "Invalid Email");
          done();
        });
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
