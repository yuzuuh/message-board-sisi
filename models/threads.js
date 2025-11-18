"use strict";

const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  _id: String,
  text: String,
  created_on: { type: Date, default: Date.now },
  delete_password: String,
  reported: { type: Boolean, default: false }
});

const threadSchema = new mongoose.Schema({
  board: String,
  text: String,
  created_on: { type: Date, default: Date.now },
  bumped_on: { type: Date, default: Date.now },
  delete_password: String,
  reported: { type: Boolean, default: false },
  replies: [replySchema]
});

module.exports = mongoose.model("Thread", threadSchema);
