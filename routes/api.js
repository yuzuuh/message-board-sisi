const express = require('express');
const router = express.Router();
const threads = require('../controllers/threads');
const replies = require('../controllers/replies');


// threads
router.route('/threads/:board')
.post(threads.createThread)
.get(threads.getThreads)
.delete(threads.deleteThread)
.put(threads.reportThread);


// replies
router.route('/replies/:board')
.post(replies.createReply)
.get(replies.getThreadWithReplies)
.delete(replies.deleteReply)
.put(replies.reportReply);


module.exports = router;