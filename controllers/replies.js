const Thread = require('../models/thread');
const mongoose = require('mongoose');

// CREATE REPLY
exports.createReply = async (req, res) => {
  const board = req.params.board;
  const { thread_id, text, delete_password } = req.body;

  try {
    const reply = {
      _id: new mongoose.Types.ObjectId(),
      text,
      delete_password,
      created_on: new Date(),
      reported: false
    };

    const thread = await Thread.findByIdAndUpdate(
      thread_id,
      { 
        $push: { replies: reply },
        $set: { bumped_on: new Date() }
      },
      { new: true }
    );

    if (!thread) return res.send('thread not found');

    // FCC requiere redirección exacta así
    return res.redirect(`/b/${board}/${thread_id}`);
  } catch (err) {
    return res.status(500).send('error creating reply');
  }
};

// GET THREAD WITH REPLIES
exports.getThreadWithReplies = async (req, res) => {
  const { thread_id } = req.query;

  try {
    const thread = await Thread.findById(thread_id).lean();
    if (!thread) return res.send('thread not found');

    // FCC quiere campos filtrados
    const cleanReplies = (thread.replies || []).map(r => ({
      _id: r._id,
      text: r.text,
      created_on: r.created_on
    }));

    return res.json({
      _id: thread._id,
      text: thread.text,
      created_on: thread.created_on,
      bumped_on: thread.bumped_on,
      replies: cleanReplies
    });
  } catch (err) {
    return res.status(500).send('error getting thread');
  }
};

// DELETE REPLY
exports.deleteReply = async (req, res) => {
  const { thread_id, reply_id, delete_password } = req.body;

  try {
    const thread = await Thread.findById(thread_id);
    if (!thread) return res.send('thread not found');

    const reply = thread.replies.id(reply_id);
    if (!reply) return res.send('reply not found');

    if (reply.delete_password !== delete_password) {
      return res.send('incorrect password');
    }

    reply.text = '[deleted]';
    await thread.save();

    return res.send('success');
  } catch (err) {
    return res.status(500).send('error deleting reply');
  }
};

// REPORT REPLY
exports.reportReply = async (req, res) => {
  const { thread_id, reply_id } = req.body;

  try {
    const thread = await Thread.findById(thread_id);
    if (!thread) return res.send('thread not found');

    const reply = thread.replies.id(reply_id);
    if (!reply) return res.send('reply not found');

    reply.reported = true;
    await thread.save();

    return res.send('success');
  } catch (err) {
    return res.status(500).send('error reporting reply');
  }
};
