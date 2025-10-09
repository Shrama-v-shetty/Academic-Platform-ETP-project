const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  topic: { type: String, required: true },
  preferredDate: { type: String, required: true },
  status: { type: String, default: "Pending" }, // Pending, Approved, Completed
  counselorName: { type: String, default: "" }, // optional field
});

module.exports = mongoose.model("Session", sessionSchema);
