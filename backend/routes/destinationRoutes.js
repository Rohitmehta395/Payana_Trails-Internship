const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Destination = require("../models/Destination");
const { processImages, resolveUploadPath } = require("../middlewares/processImage");
const { requireAdmin, requireAdminIfRequested } = require("../middlewares/adminAuth");

const sanitizeDestinationName = (name = "Unnamed_Destination") =>
  name.replace(/[^a-z0-9]/gi, "_");

// Use memoryStorage so Sharp can intercept buffers before writing to disk
const upload = multer({ storage: multer.memoryStorage() });
const cpUpload = upload.fields([
  { name: 'heroImage', maxCount: 1 }
]);

// Resolves the upload folder for a destination based on the name in the request
const destFolderResolver = (req) => {
  const sanitizedName = sanitizeDestinationName(req.body.name);
  return path.join(__dirname, "..", "uploads", "Destinations", sanitizedName);
};

// GET all destinations
// Admin panel gets everything; public pages only get active destinations
router.get("/", requireAdminIfRequested, async (req, res) => {
  try {
    const isAdmin = req.query.admin === "true";
    const filter = isAdmin ? {} : { isActive: true, status: 'published' };
    const destinations = await Destination.find(filter).sort({ order: 1, createdAt: -1 });
    res.status(200).json(destinations);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch destinations", error: error.message });
  }
});

// PATCH toggle a destination's active status
router.patch("/:id/toggle", requireAdmin, async (req, res) => {
  try {
    const dest = await Destination.findById(req.params.id);
    if (!dest) return res.status(404).json({ message: "Destination not found" });
    dest.isActive = !dest.isActive;
    await dest.save();
    res.status(200).json({ isActive: dest.isActive, message: `Destination ${dest.isActive ? "activated" : "deactivated"} successfully` });
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle destination status", error: error.message });
  }
});

// PUT (Reorder) destinations
router.put("/reorder", requireAdmin, async (req, res) => {
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
router.post("/", requireAdmin, (req, res) => {
  cpUpload(req, res, function (err) {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    processImages(destFolderResolver)(req, res, async function (err2) {
      if (err2) {
        return res.status(500).json({
          success: false,
          message: err2.message,
        });
      }

      try {
        const sanitizedName = sanitizeDestinationName(req.body.name);
        const basePath = `/uploads/Destinations/${sanitizedName}/`;

        const heroImage =
          req.files && req.files["heroImage"]
            ? basePath + req.files["heroImage"][0].filename
            : "";

        if (req.body.status !== 'draft' && !heroImage) {
          return res.status(400).json({
            success: false,
            message: "Hero image is required for published destinations",
          });
        }

        const newDestination = await Destination.create({
          name: req.body.name,
          geography: req.body.geography,
          heroImage,
          status: req.body.status || 'draft',
        });

        res.status(201).json({
          success: true,
          data: newDestination,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    });
  });
});

// PUT (Update) a destination
router.put("/:id", requireAdmin, cpUpload, processImages(destFolderResolver), async (req, res) => {
  try {
    const destId = req.params.id;
    let updateData = { ...req.body };

    const sanitizedName = sanitizeDestinationName(updateData.name);
    const basePath = `/uploads/Destinations/${sanitizedName}/`;

    if (req.files && req.files['heroImage']) {
      updateData.heroImage = basePath + req.files['heroImage'][0].filename;
      
      const oldDest = await Destination.findById(destId);
      if (oldDest && oldDest.heroImage) {
        // resolveUploadPath strips the leading "/" to avoid the Windows path.join trap
        fs.unlink(resolveUploadPath(oldDest.heroImage), (err) => {
          if (err) console.error("Failed to delete old hero image:", err.message);
          else console.log("Deleted old hero image:", oldDest.heroImage);
        });
      }
    }

    const updatedDest = await Destination.findByIdAndUpdate(destId, updateData, {
      returnDocument: 'after',
      runValidators: true,
    });
    
    if (!updatedDest) return res.status(404).json({ message: "Destination not found" });

    res.status(200).json({ destination: updatedDest, imageStats: req.imageStats || [] });
  } catch (error) {
    res.status(400).json({ message: "Failed to update destination", error: error.message });
  }
});

// DELETE a destination
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const destId = req.params.id;
    const destToDelete = await Destination.findById(destId);

    if (!destToDelete) return res.status(404).json({ message: "Destination not found" });

    const sanitizedName = sanitizeDestinationName(destToDelete.name);
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
