const express = require("express");
const Quiz = require("../models/Quiz");
const router = express.Router();

// ✅ Create a new quiz
router.post("/create", async (req, res) => {
  try {
    const { title, questions, createdBy } = req.body;

    if (!title || !questions || !createdBy) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newQuiz = new Quiz({ title, questions, createdBy });
    await newQuiz.save();

    res.status(201).json({ message: "Quiz created successfully", quiz: newQuiz });
  } catch (error) {
    console.error("Error creating quiz:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get all quizzes
router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Submit quiz answers
router.post("/submit/:quizId", async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body; // e.g. [{questionId, selectedAnswer}]

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    let score = 0;

    quiz.questions.forEach((q, index) => {
      if (answers[index] && answers[index].selectedAnswer === q.correctAnswer) {
        score++;
      }
    });

    res.status(200).json({
      message: "Quiz submitted successfully",
      totalQuestions: quiz.questions.length,
      score,
    });
  } catch (error) {
    console.error("Error submitting quiz:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
