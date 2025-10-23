const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Counselor = require("../models/Counselor");

const router = express.Router();

// Helper to get model by role (case-insensitive)
function getModel(role) {
  if (!role) return null;
  role = role.toLowerCase();
  if (role === "student") return Student;
  if (role === "teacher") return Teacher;
  if (role === "counselor") return Counselor;
  return null;
}

// REGISTER
router.post("/register", async (req, res) => {
  const { username, email, password, confirmPassword, role } = req.body;

  if (!username || !email || !password || !confirmPassword || !role) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const Model = getModel(role);
  if (!Model) return res.status(400).json({ message: "Invalid role" });

  try {
    const existingStudent = await Student.findOne({ email });
    const existingTeacher = await Teacher.findOne({ email });
    const existingCounselor = await Counselor.findOne({ email });

    if (existingStudent || existingTeacher || existingCounselor) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Model({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully` });
  } catch (error) {
    console.error("Error in register route:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  const Model = getModel(role);
  if (!Model) return res.status(400).json({ message: "Invalid role" });

  try {
    const user = await Model.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email, role },
    });
  } catch (error) {
    console.error("Error in login route:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

