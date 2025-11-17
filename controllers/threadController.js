const Thread = require('../models/thread');


exports.createThread = async (req, res) => {
const board = req.params.board;
const { text, delete_password } = req.body;
try {
const thread = new Thread({ board, text, delete_password });
await thread.save();
res.redirect(`/b/${board}/`);
} catch (err) {
res.status(500).send('error creating thread');
}
};


exports.getThreads = async (req, res) => {
const board = req.params.board;
try {
const threads = await Thread.find({ board })
.sort({ bumped_on: -1 })
.limit(10)
.lean();


const result = threads.map(t => {
const sortedReplies = (t.replies || []).sort((a,b) => b.created_on - a.created_on);
const shortReplies = sortedReplies.slice(0, 3).map(r => ({
_id: r._id,
text: r.text,
created_on: r.created_on
}));
return {
_id: t._id,
text: t.text,
created_on: t.created_on,
bumped_on: t.bumped_on,
replies: shortReplies,
replycount: t.replies.length
};
});


res.json(result);
} catch (err) {
res.status(500).send('error getting threads');
}
};


exports.deleteThread = async (req, res) => {
const board = req.params.board;
const { thread_id, delete_password } = req.body;
try {
const thread = await Thread.findById(thread_id);
if (!thread || thread.board !== board) return res.send('incorrect thread id');
if (thread.delete_password !== delete_password) return res.send('incorrect password');
await Thread.findByIdAndDelete(thread_id);
res.send('success');
} catch (err) {
res.status(500).send('error deleting thread');
}
};


exports.reportThread = async (req, res) => {
const { thread_id } = req.body;
try {
await Thread.findByIdAndUpdate(thread_id, { reported: true });
res.send('success');
} catch (err) {
res.status(500).send('error reporting thread');
}
};