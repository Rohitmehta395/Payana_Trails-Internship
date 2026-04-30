const express = require("express");
const router = express.Router();
const multer = require("multer");
const { requireAdmin } = require("../middlewares/adminAuth");

const {
  getStoriesPage,
  updateTravelStoriesSection,
  updateVoicesSection,
  updateNewsletterSection,
  getBlogs,
  getBlogsAdmin,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  reorderBlogs,
  autosaveBlog,
  uploadBlogEditorImage,
} = require("../controllers/storiesController");

// Memory storage for sharp processing
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// ─── Stories Page Section ────────────────────────────────────────────────────
router.get("/", getStoriesPage);

router.put(
  "/travel-stories",
  requireAdmin,
  upload.fields([{ name: "image", maxCount: 1 }]),
  updateTravelStoriesSection,
);

router.put(
  "/voices-section",
  requireAdmin,
  upload.fields([{ name: "image", maxCount: 1 }]),
  updateVoicesSection,
);

router.put(
  "/newsletter-section",
  requireAdmin,
  updateNewsletterSection,
);


// ─── Blog Routes ─────────────────────────────────────────────────────────────

// Public
router.get("/blogs", getBlogs);
router.get("/blogs/slug/:slug", getBlogBySlug);

// Admin
router.get("/blogs/admin", requireAdmin, getBlogsAdmin);
router.post("/blogs", requireAdmin, upload.single("featuredImage"), createBlog);
router.put("/blogs/reorder", requireAdmin, reorderBlogs);
router.put(
  "/blogs/:id",
  requireAdmin,
  upload.single("featuredImage"),
  updateBlog,
);
router.delete("/blogs/:id", requireAdmin, deleteBlog);
router.patch("/blogs/:id/autosave", requireAdmin, autosaveBlog);

// Editor image upload (inline images in blog content)
router.post(
  "/blogs/editor-image/:slug",
  requireAdmin,
  upload.single("image"),
  uploadBlogEditorImage,
);

module.exports = router;
