const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  let testThreadId;
  let testReplyId;

  suite("Threads API", function () {
    test("POST create a thread", (done) => {
      chai
        .request(server)
        .post("/api/threads/testboard")
        .send({ text: "Test thread", delete_password: "pass" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.text, "Test thread");
          testThreadId = res.body._id;
          done();
        });
    });

    test("GET list threads", (done) => {
      chai
        .request(server)
        .get("/api/threads/testboard")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });

    test("PUT report a thread", (done) => {
      chai
        .request(server)
        .put("/api/threads/testboard")
        .send({ report_id: testThreadId })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, "reported");
          done();
        });
    });

    test("DELETE delete a thread", (done) => {
      chai
        .request(server)
        .delete("/api/threads/testboard")
        .send({
          thread_id: testThreadId,
          delete_password: "pass",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, "success");
          done();
        });
    });
  });

  suite("Replies API", function () {
    let newThreadId;

    test("POST create thread for replies", (done) => {
      chai
        .request(server)
        .post("/api/threads/testboard")
        .send({ text: "Thread for replies", delete_password: "pass" })
        .end((err, res) => {
          newThreadId = res.body._id;
          done();
        });
    });

    test("POST add reply", (done) => {
      chai
        .request(server)
        .post("/api/replies/testboard")
        .send({
          thread_id: newThreadId,
          text: "Reply test",
          delete_password: "pass",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          testReplyId = res.body.replies[0]._id;
          done();
        });
    });

    test("GET thread with replies", (done) => {
      chai
        .request(server)
        .get("/api/replies/testboard")
        .query({ thread_id: newThreadId })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body.replies);
          done();
        });
    });

    test("PUT report reply", (done) => {
      chai
        .request(server)
        .put("/api/replies/testboard")
        .send({
          thread_id: newThreadId,
          reply_id: testReplyId,
        })
        .end((err, res) => {
          assert.equal(res.text, "reported");
          done();
        });
    });

    test("DELETE delete reply", (done) => {
      chai
        .request(server)
        .delete("/api/replies/testboard")
        .send({
          thread_id: newThreadId,
          reply_id: testReplyId,
          delete_password: "pass",
        })
        .end((err, res) => {
          assert.equal(res.text, "success");
          done();
        });
    });
  });
});
