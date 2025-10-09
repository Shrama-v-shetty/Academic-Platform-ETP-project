const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", required: true },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed"],
    default: "pending"
  },
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model("Session", SessionSchema);
