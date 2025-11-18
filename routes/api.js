"use strict";

const ThreadsController = require("../controllers/threads");
const RepliesController = require("../controllers/replies");

module.exports = function (app) {
  
  // THREADS
  app.route("/api/threads/:board")
    .post(ThreadsController.postThread)
    .get(ThreadsController.getThreads)
    .put(ThreadsController.reportThread)
    .delete(ThreadsController.deleteThread);

  // REPLIES
  app.route("/api/replies/:board")
    .post(RepliesController.postReply)
    .get(RepliesController.getReplies)
    .put(RepliesController.reportReply)
    .delete(RepliesController.deleteReply);
};
