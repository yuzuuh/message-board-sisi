const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {

  let threadId;
  let replyId;

  suite('API ROUTING FOR /api/threads/:board', function () {

    test('POST new thread', function (done) {
      chai
        .request(server)
        .post('/api/threads/test')
        .send({
          text: 'Test thread',
          delete_password: 'pass123'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          done();
        });
    });

    test('GET most recent 10 threads', function (done) {
      chai
        .request(server)
        .get('/api/threads/test')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isAtMost(res.body.length, 10);
          assert.property(res.body[0], '_id');
          assert.property(res.body[0], 'text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'bumped_on');
          assert.property(res.body[0], 'replies');

          threadId = res.body[0]._id;
          done();
        });
    });

    test('PUT report thread', function (done) {
      chai
        .request(server)
        .put('/api/threads/test')
        .send({ report_id: threadId })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'reported');
          done();
        });
    });

    test('DELETE wrong password', function (done) {
      chai
        .request(server)
        .delete('/api/threads/test')
        .send({
          thread_id: threadId,
          delete_password: 'wrongpass'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        });
    });

  });

  suite('API ROUTING FOR /api/replies/:board', function () {

    test('POST new reply', function (done) {
      chai
        .request(server)
        .post('/api/replies/test')
        .send({
          thread_id: threadId,
          text: 'Test reply',
          delete_password: 'pass123'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          done();
        });
    });

    test('GET thread with all replies', function (done) {
      chai
        .request(server)
        .get('/api/replies/test')
        .query({ thread_id: threadId })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, '_id');
          assert.property(res.body, 'text');
          assert.property(res.body, 'replies');

          replyId = res.body.replies[0]._id;
          done();
        });
    });

    test('PUT report reply', function (done) {
      chai
        .request(server)
        .put('/api/replies/test')
        .send({
          thread_id: threadId,
          reply_id: replyId
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'reported');
          done();
        });
    });

    test('DELETE reply wrong password', function (done) {
      chai
        .request(server)
        .delete('/api/replies/test')
        .send({
          thread_id: threadId,
          reply_id: replyId,
          delete_password: 'wrongpass'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        });
    });

    test('DELETE reply correct password', function (done) {
      chai
        .request(server)
        .delete('/api/replies/test')
        .send({
          thread_id: threadId,
          reply_id: replyId,
          delete_password: 'pass123'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
    });

  });

});
