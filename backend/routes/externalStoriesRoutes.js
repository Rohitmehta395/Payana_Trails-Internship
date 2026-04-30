const express = require("express");
const router = express.Router();
const multer = require("multer");
const { requireAdmin } = require("../middlewares/adminAuth");

const {
  getExternalStories,
  getExternalStoriesAdmin,
  createExternalStory,
  updateExternalStory,
  deleteExternalStory,
  reorderExternalStories,
  autosaveExternalStory,
} = require("../controllers/externalStoriesController");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Public
router.get("/", getExternalStories);

// Admin
router.get("/admin", requireAdmin, getExternalStoriesAdmin);
router.post(
  "/",
  requireAdmin,
  upload.single("featuredImage"),
  createExternalStory
);
router.put(
  "/reorder",
  requireAdmin,
  reorderExternalStories
);
router.put(
  "/:id",
  requireAdmin,
  upload.single("featuredImage"),
  updateExternalStory
);
router.delete("/:id", requireAdmin, deleteExternalStory);
router.patch("/:id/autosave", requireAdmin, autosaveExternalStory);

module.exports = router;
