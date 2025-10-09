const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor" },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
}, { timestamps: true });

module.exports = mongoose.model("Group", GroupSchema);

