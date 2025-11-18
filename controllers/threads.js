const Thread = require('../models/threads');
const Reply = require('../models/Reply');

module.exports = {
  async getThreads(req, res) {
    const { board } = req.params;
    const threads = await Thread.find({ board })
      .sort({ bumped_on: -1 })
      .limit(10)
      .lean();

    const cleaned = threads.map(t => ({
      _id: t._id,
      text: t.text,
      created_on: t.created_on,
      bumped_on: t.bumped_on,
      replies: t.replies.slice(-3).map(r => ({
        _id: r._id,
        text: r.text,
        created_on: r.created_on
      }))
    }));

    res.json(cleaned);
  },

  async createThread(req, res) {
    const { board } = req.params;
    const { text, delete_password } = req.body;

    const thread = new Thread({
      board,
      text,
      delete_password,
      created_on: new Date(),
      bumped_on: new Date(),
      reported: false,
      replies: []
    });

    await thread.save();
    res.json(thread);
  },

  async reportThread(req, res) {
    const { thread_id } = req.body;
    await Thread.findByIdAndUpdate(thread_id, { reported: true });
    res.send("reported");
  }
};
