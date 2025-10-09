const express = require("express");
const Group = require("../models/Group");
const Mentor = require("../models/Mentor");
const User = require("../models/User");
const router = express.Router();


// ✅ Create a new group
router.post("/create", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Group name required" });

    const existing = await Group.findOne({ name });
    if (existing) return res.status(400).json({ message: "Group already exists" });

    const newGroup = new Group({ name });
    await newGroup.save();
    res.status(201).json({ message: "Group created", group: newGroup });
  } catch (error) {
    console.error("Error creating group:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Add a new mentor
router.post("/mentor/add", async (req, res) => {
  try {
    const { name, email, expertise } = req.body;

    if (!name || !email || !expertise)
      return res.status(400).json({ message: "All fields required" });

    const existingMentor = await Mentor.findOne({ email });
    if (existingMentor)
      return res.status(400).json({ message: "Mentor already exists" });

    const mentor = new Mentor({ name, email, expertise });
    await mentor.save();
    res.status(201).json({ message: "Mentor added", mentor });
  } catch (error) {
    console.error("Error adding mentor:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Assign a mentor to a group
router.put("/assign-mentor", async (req, res) => {
  try {
    const { groupName, mentorEmail } = req.body;

    const group = await Group.findOne({ name: groupName });
    const mentor = await Mentor.findOne({ email: mentorEmail });

    if (!group || !mentor)
      return res.status(404).json({ message: "Group or Mentor not found" });

    group.mentor = mentor._id;
    await group.save();

    res.status(200).json({ message: "Mentor assigned successfully", group });
  } catch (error) {
    console.error("Error assigning mentor:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Add student to a group
router.put("/add-student", async (req, res) => {
  try {
    const { groupName, studentEmail } = req.body;

    const group = await Group.findOne({ name: groupName });
    const student = await User.findOne({ email: studentEmail });

    if (!group || !student)
      return res.status(404).json({ message: "Group or Student not found" });

    if (group.students.includes(student._id)) {
      return res.status(400).json({ message: "Student already in group" });
    }

    group.students.push(student._id);
    await group.save();

    res.status(200).json({ message: "Student added successfully", group });
  } catch (error) {
    console.error("Error adding student:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ View all groups with mentor and students
router.get("/", async (req, res) => {
  try {
    const groups = await Group.find()
      .populate("mentor", "name email expertise")
      .populate("students", "username email");
    res.status(200).json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
