const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const homePageController = require("../controllers/homePageController");
const { requireAdmin } = require("../middlewares/adminAuth"); // ensure admin authentication
const { processImages } = require("../middlewares/processImage");

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

// Route: Update home page content (admin only)
router.put(
  "/",
  requireAdmin,
  handleUpload,
  processImages(folderResolver),
  homePageController.updateHomePage
);

module.exports = router;
