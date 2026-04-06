const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Trail = require("../models/Trail");
const { processImages, resolveUploadPath, getImageStats } = require("../middlewares/processImage");

// Use memoryStorage so Sharp can intercept buffers before writing to disk
const upload = multer({ storage: multer.memoryStorage() });
const cpUpload = upload.fields([
  { name: 'routeMap', maxCount: 1 },
  { name: 'heroImage', maxCount: 1 },
  { name: 'trailImages', maxCount: 20 }
]);

// Resolves the upload folder for a trail based on the trail name in the request
const trailFolderResolver = (req) => {
  const sanitizedName = (req.body.trailName || "Unnamed_Trail").replace(/[^a-z0-9]/gi, '_');
  return path.join(__dirname, "..", "uploads", "Trails", sanitizedName);
};

// GET all trails
// Admin panel gets everything; public pages only get active trails
router.get("/", async (req, res) => {
  try {
    const isAdmin = req.query.admin === "true";
    const filter = isAdmin ? {} : { isActive: true };
    const trails = await Trail.find(filter).sort({ order: 1, createdAt: -1 });
    res.status(200).json(trails);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch trails", error: error.message });
  }
});

// PATCH toggle a trail's active status
router.patch("/:id/toggle", async (req, res) => {
  try {
    const trail = await Trail.findById(req.params.id);
    if (!trail) return res.status(404).json({ message: "Trail not found" });
    trail.isActive = !trail.isActive;
    await trail.save();
    res.status(200).json({ isActive: trail.isActive, message: `Trail ${trail.isActive ? "activated" : "deactivated"} successfully` });
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle trail status", error: error.message });
  }
});

// PUT (Reorder) trails
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

    await Trail.bulkWrite(bulkOps);
    res.status(200).json({ message: "Trails reordered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to reorder trails", error: error.message });
  }
});

// POST image compression preview for admin uploads
router.post("/preview-image-stats", cpUpload, async (req, res) => {
  try {
    const imageStats = await getImageStats(req.files || {});
    res.status(200).json({ imageStats });
  } catch (error) {
    console.error("Error previewing trail image compression:", error);
    res.status(400).json({
      message: "Failed to preview image compression",
      error: error.message,
    });
  }
});

// POST a new trail
router.post("/", cpUpload, processImages(trailFolderResolver), async (req, res) => {
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
    res.status(201).json({ trail: savedTrail, imageStats: req.imageStats || [] });
  } catch (error) {
    res.status(400).json({ message: "Failed to create trail", error: error.message });
  }
});

// --- NEW: PUT (Update) a trail ---
router.put("/:id", cpUpload, processImages(trailFolderResolver), async (req, res) => {
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
        // resolveUploadPath strips the leading "/" so path.resolve works correctly
        // on both Windows and Linux, avoiding the drive-root-relative trap.
        const filePath = resolveUploadPath(img);
        fs.unlink(filePath, (err) => {
          if (err) console.error("Failed to delete old image file:", filePath, err.message);
          else console.log("Deleted old image:", filePath);
        });
      });
    }

    const updatedTrail = await Trail.findByIdAndUpdate(trailId, updateData, {
      returnDocument: 'after',
    });
    if (!updatedTrail)
      return res.status(404).json({ message: "Trail not found" });

    res.status(200).json({ trail: updatedTrail, imageStats: req.imageStats || [] });
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
