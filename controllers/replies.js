const Thread = require('../models/Thread');

module.exports = {
  async getReplies(req, res) {
    const { thread_id } = req.query;
    const thread = await Thread.findById(thread_id).lean();

    if (!thread) return res.json({});

    const cleaned = {
      _id: thread._id,
      text: thread.text,
      created_on: thread.created_on,
      bumped_on: thread.bumped_on,
      replies: thread.replies.map(r => ({
        _id: r._id,
        text: r.text,
        created_on: r.created_on
      }))
    };

    res.json(cleaned);
  },

  async createReply(req, res) {
    const { board } = req.params;
    const { thread_id, text, delete_password } = req.body;

    const reply = {
      _id: new Date().getTime().toString(),
      text,
      created_on: new Date(),
      delete_password,
      reported: false
    };

    const thread = await Thread.findById(thread_id);

    thread.replies.push(reply);
    thread.bumped_on = new Date();

    await thread.save();

    res.json(thread);
  },

  async reportReply(req, res) {
    const { thread_id, reply_id } = req.body;

    const thread = await Thread.findById(thread_id);
    const reply = thread.replies.id(reply_id);

    if (reply) reply.reported = true;

    await thread.save();
    res.send("reported");
  }
};
