const express = require("express");
const Session = require("../models/Session");
const router = express.Router();

// ✅ Student requests a counseling session
router.post("/request", async (req, res) => {
  try {
    const { studentName, studentEmail, topic, preferredDate } = req.body;

    if (!studentName || !studentEmail || !topic || !preferredDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newSession = new Session({
      studentName,
      studentEmail,
      topic,
      preferredDate,
    });

    await newSession.save();
    res.status(201).json({ message: "Counseling session requested", session: newSession });
  } catch (error) {
    console.error("Error requesting session:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Admin or teacher views all session requests
router.get("/", async (req, res) => {
  try {
    const sessions = await Session.find();
    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Admin/teacher updates session status (approve, complete, etc.)
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, counselorName } = req.body;

    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (status) session.status = status;
    if (counselorName) session.counselorName = counselorName;

    await session.save();
    res.status(200).json({ message: "Session updated", session });
  } catch (error) {
    console.error("Error updating session:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
