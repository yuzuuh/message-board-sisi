'use strict';

const express = require('express');
const router = express.Router();

let threads = {}; // { boardName: [ { thread }, { thread } ] }

router.route('/threads/:board')

  // GET threads
  .get((req, res) => {
    const board = req.params.board;
    res.json(threads[board] || []);
  })

  // POST new thread
  .post((req, res) => {
    const board = req.params.board;
    const { text, delete_password } = req.body;

    if (!threads[board]) threads[board] = [];

    const newThread = {
      _id: Date.now().toString(),
      text,
      delete_password,
      replies: []
    };

    threads[board].push(newThread);

    res.json(newThread);
  })

  // DELETE thread
  .delete((req, res) => {
    const board = req.params.board;
    const { thread_id, delete_password } = req.body;

    if (!threads[board]) return res.send('incorrect password');

    const threadIndex = threads[board].findIndex(t => t._id === thread_id);

    if (threadIndex === -1) return res.send('incorrect password');

    if (threads[board][threadIndex].delete_password !== delete_password) {
      return res.send('incorrect password');
    }

    threads[board].splice(threadIndex, 1);
    res.send('success');
  });


// Replies
router.route('/replies/:board')

  // GET replies
  .get((req, res) => {
    const board = req.params.board;
    const thread_id = req.query.thread_id;

    const thread = (threads[board] || []).find(t => t._id === thread_id);
    if (!thread) return res.json({});

    res.json(thread);
  })

  // POST reply
  .post((req, res) => {
    const board = req.params.board;
    const { thread_id, text, delete_password } = req.body;

    const thread = (threads[board] || []).find(t => t._id === thread_id);
    if (!thread) return res.send('thread not found');

    const reply = {
      _id: Date.now().toString(),
      text,
      delete_password
    };

    thread.replies.push(reply);

    res.json(thread);
  })

  // DELETE reply
  .delete((req, res) => {
    const board = req.params.board;
    const { thread_id, reply_id, delete_password } = req.body;

    const thread = (threads[board] || []).find(t => t._id === thread_id);
    if (!thread) return res.send('incorrect password');

    const reply = thread.replies.find(r => r._id === reply_id);
    if (!reply) return res.send('incorrect password');

    if (reply.delete_password !== delete_password) {
      return res.send('incorrect password');
    }

    reply.text = '[deleted]';
    res.send('success');
  });

module.exports = router;
