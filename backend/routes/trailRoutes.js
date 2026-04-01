const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Needed to delete old images
const Trail = require("../models/Trail");

// --- Multer Configuration --- (Keep your existing multer config)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/Trails/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// GET all trails (Keep your existing route)
router.get("/", async (req, res) => {
  try {
    const trails = await Trail.find().sort({ createdAt: -1 });
    res.status(200).json(trails);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch trails", error: error.message });
  }
});

// POST a new trail (Keep your existing route)
router.post("/", upload.single("routeMap"), async (req, res) => {
  // ... your existing POST code ...
  try {
    if (!req.file)
      return res.status(400).json({ message: "Image is required" });
    const imagePath = `/uploads/Trails/${req.file.filename}`;
    const trailData = {
      ...req.body,
      routeMap: imagePath,
      highlights: req.body.highlights ? JSON.parse(req.body.highlights) : [],
      whatsIncluded: req.body.whatsIncluded
        ? JSON.parse(req.body.whatsIncluded)
        : [],
      whatsNotIncluded: req.body.whatsNotIncluded
        ? JSON.parse(req.body.whatsNotIncluded)
        : [],
    };
    const newTrail = new Trail(trailData);
    const savedTrail = await newTrail.save();
    res.status(201).json(savedTrail);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to create trail", error: error.message });
  }
});

// --- NEW: PUT (Update) a trail ---
router.put("/:id", upload.single("routeMap"), async (req, res) => {
  try {
    const trailId = req.params.id;
    let updateData = { ...req.body };

    // Parse arrays
    if (updateData.highlights)
      updateData.highlights = JSON.parse(updateData.highlights);
    if (updateData.whatsIncluded)
      updateData.whatsIncluded = JSON.parse(updateData.whatsIncluded);
    if (updateData.whatsNotIncluded)
      updateData.whatsNotIncluded = JSON.parse(updateData.whatsNotIncluded);

    // If a new image was uploaded, update the image path
    if (req.file) {
      updateData.routeMap = `/uploads/Trails/${req.file.filename}`;

      // Optional: You could write code here to find the old trail and delete its old image
    }

    const updatedTrail = await Trail.findByIdAndUpdate(trailId, updateData, {
      new: true,
    });
    if (!updatedTrail)
      return res.status(404).json({ message: "Trail not found" });

    res.status(200).json(updatedTrail);
  } catch (error) {
    console.error("Error updating trail:", error);
    res
      .status(400)
      .json({ message: "Failed to update trail", error: error.message });
  }
});

// --- NEW: DELETE a trail ---
router.delete("/:id", async (req, res) => {
  try {
    const trailId = req.params.id;
    const trailToDelete = await Trail.findById(trailId);

    if (!trailToDelete)
      return res.status(404).json({ message: "Trail not found" });

    // Delete the image file from the server
    if (trailToDelete.routeMap) {
      // routeMap looks like "/uploads/Trails/123.jpg". We need to map it to the actual file system path.
      const filePath = path.join(__dirname, "..", trailToDelete.routeMap);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete image file:", err);
      });
    }

    await Trail.findByIdAndDelete(trailId);
    res.status(200).json({ message: "Trail deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete trail", error: error.message });
  }
});

module.exports = router;
