"use strict";

const Thread = require("../models/Thread");

module.exports = {
  
  // ✔ POST thread
  async postThread(req, res) {
    const board = req.params.board;
    const { text, delete_password } = req.body;

    const thread = new Thread({
      board,
      text,
      delete_password,
      replies: []
    });

    await thread.save();
    res.json(thread);
  },

  // ✔ GET threads (10 most recent + 3 replies)
  async getThreads(req, res) {
    const board = req.params.board;

    const threads = await Thread.find({ board })
      .sort({ bumped_on: -1 })
      .limit(10)
      .lean();

    const cleaned = threads.map(t => {
      delete t.delete_password;
      delete t.reported;

      t.replies = t.replies
        .sort((a, b) => b.created_on - a.created_on)
        .slice(0, 3)
        .map(r => {
          delete r.delete_password;
          delete r.reported;
          return r;
        });

      return t;
    });

    res.json(cleaned);
  },

  // ✔ REPORT thread
  async reportThread(req, res) {
    await Thread.findByIdAndUpdate(req.body.thread_id, { reported: true });
    res.send("reported");
  },

  // ✔ DELETE thread
  async deleteThread(req, res) {
    const thread = await Thread.findById(req.body.thread_id);

    if (!thread) return res.send("thread not found");
    if (thread.delete_password !== req.body.delete_password)
      return res.send("incorrect password");

    await Thread.findByIdAndDelete(req.body.thread_id);
    res.send("success");
  }
};
