const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", default: null },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

module.exports = mongoose.model("Group", groupSchema);
