const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const homePageController = require("../controllers/homePageController");
const { requireAdmin } = require("../middlewares/adminAuth"); // ensure admin authentication
const { processImages, getImageStats } = require("../middlewares/processImage");

// We use memory storage to buffer files for Sharp
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max per image
});

const sectionMap = {
  thePayanaWayHeroImage: "thePayanaWay",
  storiesHeroImage: "storiesVoices",
  connectHeroImage: "connect",
  referFriendsHeroImage: "referFriends",
  giftJourneyHeroImage: "giftJourney"
};

const folderResolver = (req, fieldname) => {
  const sectionName = sectionMap[fieldname] || "misc";
  return path.join(__dirname, "..", "uploads", "homePage", sectionName);
};

// Route: Get home page content (public)
router.get("/", homePageController.getHomePage);

// Wrapper to handle Multer errors gracefully
const uploadFields = upload.fields([
  { name: "thePayanaWayHeroImage", maxCount: 1 },
  { name: "storiesHeroImage", maxCount: 1 },
  { name: "connectHeroImage", maxCount: 1 },
  { name: "referFriendsHeroImage", maxCount: 1 },
  { name: "giftJourneyHeroImage", maxCount: 1 },
]);

const handleUpload = (req, res, next) => {
  uploadFields(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ message: "File is too large. Please upload an image smaller than 20MB." });
      }
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ message: `Server error during upload: ${err.message}` });
    }
    next();
  });
};

// Route: Preview home page image compression stats (admin only)
router.post(
  "/preview-image-stats",
  requireAdmin,
  handleUpload,
  async (req, res) => {
    try {
      const imageStats = await getImageStats(req.files || {});
      return res.status(200).json({ imageStats });
    } catch (error) {
      console.error("Error previewing home page image compression:", error);
      return res.status(500).json({ message: "Failed to preview image compression" });
    }
  },
);

// Route: Update home page content (admin only)
router.put(
  "/",
  requireAdmin,
  handleUpload,
  processImages(folderResolver),
  homePageController.updateHomePage
);

// Testimonial specific routes
const uploadTestimonialsMulti = upload.array("testimonialImages", 20);

router.post(
  "/testimonials",
  requireAdmin,
  (req, res, next) => {
    uploadTestimonialsMulti(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({ message: "File is too large. Max size 20MB." });
        }
        return res.status(400).json({ message: `Upload error: ${err.message}` });
      } else if (err) {
        return res.status(500).json({ message: `Server error during upload: ${err.message}` });
      }
      next();
    });
  },
  homePageController.uploadTestimonials
);

router.put(
  "/testimonials/reorder",
  requireAdmin,
  homePageController.reorderTestimonials
);

router.put(
  "/testimonials/:imageId",
  requireAdmin,
  upload.single("testimonialImage"),
  homePageController.updateTestimonial
);

router.delete(
  "/testimonials/:imageId",
  requireAdmin,
  homePageController.deleteTestimonial
);

module.exports = router;
