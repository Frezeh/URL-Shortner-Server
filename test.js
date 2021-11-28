const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("./app");
const should = chai.should();
chai.use(chaiHttp);

describe("Testing POST on /url ", () => {
  it("It should convert the long url to a short url", (done) => {
    const body = {
      longUrl: "https://www.google.com",
    };
    chai
      .request(app)
      .post("/url")
      .send(body)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("urlCode");
        res.body.should.have.property("longUrl");
        res.body.should.have.property("shortUrl");
        res.body.should.have.property("history");
        res.body.should.have.property("date");
        done();
      });
  });
});

describe("Testing GET on /redirect ", () => {
  it("It should redirect the short url to the long url at all times", (done) => {
    chai
      .request(app)
      .get("/redirect/t77xaCxMQ")
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

describe("Testing GET on /history ", () => {
  it("It should get the statistics of the short url", (done) => {
    chai
      .request(app)
      .get("/history/t77xaCxMQ")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("Array");
        done();
      });
  });
});
