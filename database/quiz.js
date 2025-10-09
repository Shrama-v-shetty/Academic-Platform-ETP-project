const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [{
    questionText: String,
    options: [String],
    correctAnswer: String,
  }],
}, { timestamps: true });

module.exports = mongoose.model("Quiz", QuizSchema);

