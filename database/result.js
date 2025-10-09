const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  score: Number,
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId },
    selectedAnswer: String,
    isCorrect: Boolean,
  }],
}, { timestamps: true });

module.exports = mongoose.model("Result", ResultSchema);


