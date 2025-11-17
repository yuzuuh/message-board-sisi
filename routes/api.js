const express = require('express');
const router = express.Router();

// Base de datos en memoria
const threadsDB = {}; // { board: [ { ...thread } ] }

// Generador simple de IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// ===============================
// THREADS
// ===============================
router.route('/threads/:board')

  // Crear thread
  .post((req, res) => {
    const board = req.params.board;
    const { text, delete_password } = req.body;

    if (!threadsDB[board]) threadsDB[board] = [];

    const newThread = {
      _id: generateId(),
      text,
      created_on: new Date(),
      bumped_on: new Date(),
      reported: false,
      delete_password,
      replies: []
    };

    threadsDB[board].push(newThread);

    // FCC no quiere delete_password ni reported en la respuesta
    res.json({
      _id: newThread._id,
      text: newThread.text,
      created_on: newThread.created_on,
      bumped_on: newThread.bumped_on,
      replies: []
    });
  })

  // Obtener threads (máx. 10, ordenados por bumped_on desc., replies máx. 3)
  .get((req, res) => {
    const board = req.params.board;
    const threads = threadsDB[board] || [];

    const response = threads
      .sort((a, b) => b.bumped_on - a.bumped_on) // requerido por FCC
      .slice(0, 10)
      .map(t => ({
        _id: t._id,
        text: t.text,
        created_on: t.created_on,
        bumped_on: t.bumped_on,
        replies: t.replies.slice(-3).map(r => ({
          _id: r._id,
          text: r.text,
          created_on: r.created_on
        })),
        replycount: t.replies.length
      }));

    res.json(response);
  })

  // Borrar thread
  .delete((req, res) => {
    const board = req.params.board;
    const { thread_id, delete_password } = req.body;

    if (!threadsDB[board]) return res.send('incorrect password');

    const index = threadsDB[board].findIndex(t => t._id === thread_id);
    if (index === -1) return res.send('incorrect password');

    if (threadsDB[board][index].delete_password !== delete_password)
      return res.send('incorrect password');

    threadsDB[board].splice(index, 1);
    res.send('success');
  })

  // Reportar thread
  .put((req, res) => {
    const board = req.params.board;
    const thread_id = req.body.thread_id || req.body.report_id;

    const thread = (threadsDB[board] || []).find(t => t._id === thread_id);
    if (!thread) return res.send('not found');

    thread.reported = true;
    res.send('reported');
  });

// ===============================
// REPLIES
// ===============================
router.route('/replies/:board')

  // Crear reply
  .post((req, res) => {
    const board = req.params.board;
    const { thread_id, text, delete_password } = req.body;

    const thread = (threadsDB[board] || []).find(t => t._id === thread_id);
    if (!thread) return res.send('thread not found');

    const reply = {
      _id: generateId(),
      text,
      created_on: new Date(),
      delete_password,
      reported: false
    };

    thread.replies.push(reply);
    thread.bumped_on = new Date();

    // FCC no acepta delete_password ni reported en la respuesta
    res.json({
      _id: thread._id,
      text: thread.text,
      created_on: thread.created_on,
      bumped_on: thread.bumped_on,
      replies: thread.replies.map(r => ({
        _id: r._id,
        text: r.text,
        created_on: r.created_on
      }))
    });
  })

  // Obtener thread con replies
  .get((req, res) => {
    const board = req.params.board;
    const thread_id = req.query.thread_id;

    const thread = (threadsDB[board] || []).find(t => t._id === thread_id);
    if (!thread) return res.send('not found');

    res.json({
      _id: thread._id,
      text: thread.text,
      created_on: thread.created_on,
      bumped_on: thread.bumped_on,
      replies: thread.replies.map(r => ({
        _id: r._id,
        text: r.text,
        created_on: r.created_on
      }))
    });
  })

  // Borrar reply
  .delete((req, res) => {
    const board = req.params.board;
    const { thread_id, reply_id, delete_password } = req.body;

    const thread = (threadsDB[board] || []).find(t => t._id === thread_id);
    if (!thread) return res.send('not found');

    const reply = thread.replies.find(r => r._id === reply_id);
    if (!reply) return res.send('not found');

    if (reply.delete_password !== delete_password)
      return res.send('incorrect password');

    reply.text = '[deleted]';
    res.send('success');
  })

  // Reportar reply
  .put((req, res) => {
    const board = req.params.board;
    const thread_id = req.body.thread_id || req.body.report_id;
    const reply_id = req.body.reply_id;

    const thread = (threadsDB[board] || []).find(t => t._id === thread_id);
    if (!thread) return res.send('not found');

    const reply = thread.replies.find(r => r._id === reply_id);
    if (!reply) return res.send('not found');

    reply.reported = true;
    res.send('reported');
  });

module.exports = router;
