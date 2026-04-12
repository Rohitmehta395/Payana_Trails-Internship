const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
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
    const filter = isAdmin ? {} : { isActive: true, status: 'published' };
    const trails = await Trail.find(filter).sort({ order: 1, createdAt: -1 });

    // Self-healing: Ensure every trail in the response has a slug for the frontend
    const trailsWithSlugs = trails.map((trail) => {
      const trailObj = trail.toObject();
      if (!trailObj.slug) {
        // Fallback slug generation for items already in DB without slugs
        trailObj.slug = (trailObj.trailName || "unnamed")
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        
        // If still empty, use ID
        if (!trailObj.slug) trailObj.slug = trailObj._id.toString();
      }
      return trailObj;
    });

    res.status(200).json(trailsWithSlugs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch trails", error: error.message });
  }
});

// GET single trail by id or slug
router.get("/:identifier", async (req, res) => {
  try {
    const { identifier } = req.params;
    const isAdmin = req.query.admin === "true";
    
    let filter = {};
    const isObjectId = mongoose.Types.ObjectId.isValid(identifier);
    
    if (isObjectId) {
      filter = { _id: identifier };
    } else {
      filter = { slug: identifier };
    }

    if (!isAdmin) {
      filter.isActive = true;
      filter.status = 'published';
    }

    let trail = await Trail.findOne(filter);

    // Fallback: If not found by slug and identifier is not an ID, 
    // try to find by slugifying all trail names (handles legacy records)
    if (!trail && !isObjectId) {
      const allTrails = await Trail.find(isAdmin ? {} : { isActive: true, status: 'published' });
      trail = allTrails.find(t => {
        const s = (t.trailName || "")
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        return s === identifier;
      });
    }

    if (!trail) {
      return res.status(404).json({ message: "Trail not found" });
    }

    res.status(200).json(trail);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch trail", error: error.message });
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
    
    // Handle empty journeyDate string from frontend FormData
    if (trailData.journeyDate === "") {
      trailData.journeyDate = null;
    }

    if (trailData.status) {
      trailData.isActive = trailData.status === 'published';
    }

    if (trailData.status !== 'draft' && (!trailData.routeMap || !trailData.heroImage)) {
      return res.status(400).json({ message: "Both Route Map and Hero Image are required for published trails." });
    }

    const newTrail = new Trail(trailData);
    const savedTrail = await newTrail.save();
    res.status(201).json({ trail: savedTrail, imageStats: req.imageStats || [] });
  } catch (error) {
    console.error("Error creating trail:", error);
    let errMsg = error.message || "Failed to create trail";
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      errMsg = "Validation Error: " + messages.join(", ");
    }
    res.status(400).json({ message: errMsg });
  }
});

// --- NEW: PUT (Update) a trail ---
router.put("/:id", cpUpload, processImages(trailFolderResolver), async (req, res) => {
  try {
    const trailId = req.params.id;
    const existingTrail = await Trail.findById(trailId);
    if (!existingTrail) return res.status(404).json({ message: "Trail not found" });

    let updateData = { ...req.body };
    const sanitizedName = (updateData.trailName || existingTrail.trailName || "Unnamed_Trail").replace(/[^a-z0-9]/gi, '_');
    const basePath = `/uploads/Trails/${sanitizedName}/`;

    // Parse arrays
    if (updateData.highlights) updateData.highlights = JSON.parse(updateData.highlights);
    if (updateData.whatsIncluded) updateData.whatsIncluded = JSON.parse(updateData.whatsIncluded);
    if (updateData.whatsNotIncluded) updateData.whatsNotIncluded = JSON.parse(updateData.whatsNotIncluded);

    // Track old files to delete
    const filesToDelete = [];

    // If new images were uploaded, update the image paths
    if (req.files && req.files['routeMap']) {
      updateData.routeMap = basePath + req.files['routeMap'][0].filename;
      if (existingTrail.routeMap) filesToDelete.push(existingTrail.routeMap);
    }
    if (req.files && req.files['heroImage']) {
      updateData.heroImage = basePath + req.files['heroImage'][0].filename;
      if (existingTrail.heroImage) filesToDelete.push(existingTrail.heroImage);
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
      filesToDelete.push(...toDelete);
    }

    filesToDelete.forEach(img => {
      const filePath = resolveUploadPath(img);
      fs.unlink(filePath, (err) => {
        if (err && err.code !== 'ENOENT') {
          console.error("Failed to delete old image file:", filePath, err.message);
        }
      });
    });

    if (updateData.status) {
      updateData.isActive = updateData.status === 'published';
    }

    // Apply updates to the already-fetched existingTrail (avoid redundant DB call)
    // Exclude 'slug' from updateData so the pre-save hook always controls it
    delete updateData.slug;
    Object.keys(updateData).forEach(key => {
      existingTrail[key] = updateData[key];
    });

    const updatedTrail = await existingTrail.save();

    res.status(200).json({ trail: updatedTrail, imageStats: req.imageStats || [] });
  } catch (error) {
    console.error("Error updating trail:", error);
    let errMsg = error.message || "Failed to update trail";
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      errMsg = "Validation Error: " + messages.join(", ");
    }
    res.status(400).json({ message: errMsg });
  }
});

// --- NEW: DELETE a trail ---
router.delete("/:id", async (req, res) => {
  try {
    const trailId = req.params.id;
    const trailToDelete = await Trail.findById(trailId);

    if (!trailToDelete)
      return res.status(404).json({ message: "Trail not found" });

    // Extract all unique folders where this trail's images reside
    const allImages = [
      trailToDelete.routeMap,
      trailToDelete.heroImage,
      ...(trailToDelete.trailImages || [])
    ].filter(Boolean); // removes empty/null ones

    const foldersToDelete = new Set();
    allImages.forEach(imgPath => {
      try {
        const absolutePath = resolveUploadPath(imgPath);
        foldersToDelete.add(path.dirname(absolutePath));
      } catch (e) {}
    });

    // Delete the identified folders
    foldersToDelete.forEach(folderPath => {
      if (fs.existsSync(folderPath)) {
        try {
          fs.rmSync(folderPath, { recursive: true, force: true });
        } catch (e) {
          console.error(`Failed to delete folder: ${folderPath}`, e);
        }
      }
    });

    await Trail.findByIdAndDelete(trailId);
    res.status(200).json({ message: "Trail deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete trail", error: error.message });
  }
});

module.exports = router;
