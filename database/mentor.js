const mongoose = require("mongoose");

const MentorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  expertise: String,
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
}, { timestamps: true });

module.exports = mongoose.model("Mentor", MentorSchema);

