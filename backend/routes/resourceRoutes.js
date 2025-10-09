const express = require("express");
const multer = require("multer");
const PPTXGenJS = require("pptxgenjs");
const Resource = require("../models/Resource");
const router = express.Router();
const path = require("path");

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname)
});
const upload = multer({ storage });

// ✅ Upload a file
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { title, uploadedBy } = req.body;
    if (!req.file || !title || !uploadedBy) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newResource = new Resource({
      title,
      filename: req.file.filename,
      uploadedBy
    });

    await newResource.save();
    res.status(201).json({ message: "File uploaded successfully", resource: newResource });
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Generate PPT from text content
router.post("/generate-ppt", async (req, res) => {
  try {
    const { title, slides, uploadedBy } = req.body; // slides = [{heading, content}]
    if (!title || !slides || !uploadedBy) {
      return res.status(400).json({ message: "All fields required" });
    }

    let pptx = new PPTXGenJS();
    slides.forEach(slide => {
      let s = pptx.addSlide();
      s.addText(slide.heading, { x: 0.5, y: 0.5, fontSize: 24, bold: true });
      s.addText(slide.content, { x: 0.5, y: 1.5, fontSize: 18 });
    });

    const filename = Date.now() + "_" + title + ".pptx";
    const filepath = path.join(__dirname, "../uploads/", filename);

    await pptx.writeFile({ fileName: filepath });

    const newResource = new Resource({ title, filename, uploadedBy });
    await newResource.save();

    res.status(201).json({ message: "PPT generated successfully", resource: newResource });
  } catch (err) {
    console.error("PPT generation error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get all resources
router.get("/", async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
