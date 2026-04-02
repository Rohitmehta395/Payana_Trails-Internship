const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Needed to delete old images
const Trail = require("../models/Trail");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const trailName = req.body.trailName || "Unnamed_Trail";
    const sanitizedName = trailName.replace(/[^a-z0-9]/gi, '_');
    const uploadPath = path.join("uploads", "Trails", sanitizedName);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    if (file.fieldname === 'heroImage') {
      cb(null, "hero-" + Date.now() + path.extname(file.originalname));
    } else if (file.fieldname === 'routeMap') {
      cb(null, "routemap-" + Date.now() + path.extname(file.originalname));
    } else {
      cb(null, Date.now() + "-" + file.originalname);
    }
  },
});
const upload = multer({ storage: storage });
const cpUpload = upload.fields([
  { name: 'routeMap', maxCount: 1 },
  { name: 'heroImage', maxCount: 1 },
  { name: 'trailImages', maxCount: 20 }
]);

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

// POST a new trail
router.post("/", cpUpload, async (req, res) => {
  try {
    const sanitizedName = (req.body.trailName || "Unnamed_Trail").replace(/[^a-z0-9]/gi, '_');
    const basePath = `/uploads/Trails/${sanitizedName}/`;

    const trailData = {
      ...req.body,
      routeMap: req.files && req.files['routeMap'] ? basePath + req.files['routeMap'][0].filename : "",
      heroImage: req.files && req.files['heroImage'] ? basePath + req.files['heroImage'][0].filename : "",
      trailImages: req.files && req.files['trailImages'] ? req.files['trailImages'].map(f => basePath + f.filename) : [],
      highlights: req.body.highlights ? JSON.parse(req.body.highlights) : [],
      whatsIncluded: req.body.whatsIncluded ? JSON.parse(req.body.whatsIncluded) : [],
      whatsNotIncluded: req.body.whatsNotIncluded ? JSON.parse(req.body.whatsNotIncluded) : [],
    };
    
    if (!trailData.routeMap || !trailData.heroImage) {
      return res.status(400).json({ message: "Both Route Map and Hero Image are required." });
    }

    const newTrail = new Trail(trailData);
    const savedTrail = await newTrail.save();
    res.status(201).json(savedTrail);
  } catch (error) {
    res.status(400).json({ message: "Failed to create trail", error: error.message });
  }
});

// --- NEW: PUT (Update) a trail ---
router.put("/:id", cpUpload, async (req, res) => {
  try {
    const trailId = req.params.id;
    let updateData = { ...req.body };
    const sanitizedName = (updateData.trailName || "Unnamed_Trail").replace(/[^a-z0-9]/gi, '_');
    const basePath = `/uploads/Trails/${sanitizedName}/`;

    // Parse arrays
    if (updateData.highlights) updateData.highlights = JSON.parse(updateData.highlights);
    if (updateData.whatsIncluded) updateData.whatsIncluded = JSON.parse(updateData.whatsIncluded);
    if (updateData.whatsNotIncluded) updateData.whatsNotIncluded = JSON.parse(updateData.whatsNotIncluded);

    // If new images were uploaded, update the image paths
    if (req.files && req.files['routeMap']) {
      updateData.routeMap = basePath + req.files['routeMap'][0].filename;
    }
    if (req.files && req.files['heroImage']) {
      updateData.heroImage = basePath + req.files['heroImage'][0].filename;
    }
    
    // Process multiple trail images
    let finalTrailImages = [];
    if (req.body.existingTrailImages) {
      finalTrailImages = JSON.parse(req.body.existingTrailImages);
    }
    if (req.files && req.files['trailImages']) {
      finalTrailImages = finalTrailImages.concat(req.files['trailImages'].map(f => basePath + f.filename));
    }
    updateData.trailImages = finalTrailImages;

    // Remove deleted images from disk
    if (req.body.imagesToDelete) {
      const toDelete = JSON.parse(req.body.imagesToDelete);
      toDelete.forEach(img => {
         const filePath = path.join(__dirname, "..", img);
         fs.unlink(filePath, (err) => {
           if (err) console.error("Failed to delete old image file:", err);
         });
      });
    }

    const updatedTrail = await Trail.findByIdAndUpdate(trailId, updateData, {
      returnDocument: 'after',
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

    // Delete the entire trail images folder from the server
    const sanitizedName = (trailToDelete.trailName || "Unnamed_Trail").replace(/[^a-z0-9]/gi, '_');
    const folderPath = path.join(__dirname, "..", "uploads", "Trails", sanitizedName);
    
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true });
    } else {
      // Fallback clean up for old images that weren't in a named folder
      if (trailToDelete.routeMap) {
        fs.unlink(path.join(__dirname, "..", trailToDelete.routeMap), () => {});
      }
      if (trailToDelete.heroImage) {
        fs.unlink(path.join(__dirname, "..", trailToDelete.heroImage), () => {});
      }
      if (trailToDelete.trailImages) {
        trailToDelete.trailImages.forEach(img => fs.unlink(path.join(__dirname, "..", img), () => {}));
      }
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
