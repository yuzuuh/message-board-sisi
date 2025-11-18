"use strict";

const Thread = require("../models/Thread");

module.exports = {
  
  // ✔ POST reply
  async postReply(req, res) {
    const board = req.params.board;
    const { thread_id, text, delete_password } = req.body;

    const thread = await Thread.findById(thread_id);
    if (!thread) return res.send("thread not found");

    const reply = {
      _id: new Date().getTime().toString(),
      text,
      delete_password,
      created_on: new Date(),
      reported: false
    };

    thread.replies.push(reply);
    thread.bumped_on = new Date();
    await thread.save();

    res.json(thread);
  },

  // ✔ GET replies for one thread
  async getReplies(req, res) {
    const thread = await Thread.findById(req.query.thread_id).lean();
    if (!thread) return res.send("thread not found");

    delete thread.delete_password;
    delete thread.reported;

    thread.replies = thread.replies.map(r => {
      delete r.delete_password;
      delete r.reported;
      return r;
    });

    res.json(thread);
  },

  // ✔ REPORT reply
  async reportReply(req, res) {
    const { thread_id, reply_id } = req.body;

    const thread = await Thread.findById(thread_id);
    if (!thread) return res.send("thread not found");

    const reply = thread.replies.id(reply_id);
    if (!reply) return res.send("reply not found");

    reply.reported = true;
    await thread.save();

    res.send("reported");
  },

  // ✔ DELETE reply (replace text with "[deleted]")
  async deleteReply(req, res) {
    const { thread_id, reply_id, delete_password } = req.body;

    const thread = await Thread.findById(thread_id);
    if (!thread) return res.send("thread not found");

    const reply = thread.replies.id(reply_id);
    if (!reply) return res.send("reply not found");

    if (reply.delete_password !== delete_password)
      return res.send("incorrect password");

    reply.text = "[deleted]";
    await thread.save();

    res.send("success");
  }
};
