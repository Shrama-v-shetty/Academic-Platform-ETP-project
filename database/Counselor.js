const mongoose = require("mongoose");

const CounselorSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  office: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Counselor", CounselorSchema);
