const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Destination = require("../models/Destination");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationName = req.body.name || "Unnamed_Destination";
    const sanitizedName = destinationName.replace(/[^a-z0-9]/gi, '_');
    const uploadPath = path.join("uploads", "Destinations", sanitizedName);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    if (file.fieldname === 'heroImage') {
      cb(null, "hero-" + Date.now() + path.extname(file.originalname));
    } else {
      cb(null, Date.now() + "-" + file.originalname);
    }
  },
});
const upload = multer({ storage: storage });
const cpUpload = upload.fields([
  { name: 'heroImage', maxCount: 1 }
]);

// GET all destinations
router.get("/", async (req, res) => {
  try {
    const destinations = await Destination.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json(destinations);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch destinations", error: error.message });
  }
});

// PUT (Reorder) destinations
router.put("/reorder", async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { order: item.order },
      },
    }));

    await Destination.bulkWrite(bulkOps);
    res.status(200).json({ message: "Destinations reordered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to reorder destinations", error: error.message });
  }
});

// POST a new destination
router.post("/", cpUpload, async (req, res) => {
  try {
    const sanitizedName = (req.body.name || "Unnamed_Destination").replace(/[^a-z0-9]/gi, '_');
    const basePath = `/uploads/Destinations/${sanitizedName}/`;

    const heroImage = req.files && req.files['heroImage'] ? basePath + req.files['heroImage'][0].filename : "";
    
    if (!heroImage) {
      return res.status(400).json({ message: "Hero Image is required." });
    }

    const destinationData = {
      name: req.body.name,
      heroImage: heroImage
    };

    const newDest = new Destination(destinationData);
    const savedDest = await newDest.save();
    res.status(201).json(savedDest);
  } catch (error) {
    res.status(400).json({ message: "Failed to create destination", error: error.message });
  }
});

// PUT (Update) a destination
router.put("/:id", cpUpload, async (req, res) => {
  try {
    const destId = req.params.id;
    let updateData = { ...req.body };

    const sanitizedName = (updateData.name || "Unnamed_Destination").replace(/[^a-z0-9]/gi, '_');
    const basePath = `/uploads/Destinations/${sanitizedName}/`;

    if (req.files && req.files['heroImage']) {
      updateData.heroImage = basePath + req.files['heroImage'][0].filename;
      
      const oldDest = await Destination.findById(destId);
      if (oldDest && oldDest.heroImage) {
        fs.unlink(path.join(__dirname, "..", oldDest.heroImage), (err) => {});
      }
    }

    const updatedDest = await Destination.findByIdAndUpdate(destId, updateData, {
      returnDocument: 'after'
    });
    
    if (!updatedDest) return res.status(404).json({ message: "Destination not found" });

    res.status(200).json(updatedDest);
  } catch (error) {
    res.status(400).json({ message: "Failed to update destination", error: error.message });
  }
});

// DELETE a destination
router.delete("/:id", async (req, res) => {
  try {
    const destId = req.params.id;
    const destToDelete = await Destination.findById(destId);

    if (!destToDelete) return res.status(404).json({ message: "Destination not found" });

    const sanitizedName = (destToDelete.name || "Unnamed_Destination").replace(/[^a-z0-9]/gi, '_');
    const folderPath = path.join(__dirname, "..", "uploads", "Destinations", sanitizedName);
    
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true });
    }

    await Destination.findByIdAndDelete(destId);
    res.status(200).json({ message: "Destination deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete destination", error: error.message });
  }
});

module.exports = router;
