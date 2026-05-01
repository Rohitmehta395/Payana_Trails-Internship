const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const connectPageController = require("../controllers/connectPageController");
const { requireAdmin } = require("../middlewares/adminAuth");
const { processImages, getImageStats } = require("../middlewares/processImage");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

const folderResolver = () => path.join(__dirname, "..", "uploads", "connect");

router.get("/", connectPageController.getConnectPage);

const uploadFields = upload.fields([
  { name: "enquiryLeftImage", maxCount: 1 },
  { name: "enquiryRightImage", maxCount: 1 },
  { name: "referFriendImage", maxCount: 1 },
  { name: "giftJourneyImage", maxCount: 1 },
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

router.post(
  "/preview-image-stats",
  requireAdmin,
  handleUpload,
  async (req, res) => {
    try {
      const imageStats = await getImageStats(req.files || {});
      return res.status(200).json({ imageStats });
    } catch (error) {
      console.error("Error previewing connect page image compression:", error);
      return res.status(500).json({ message: "Failed to preview image compression" });
    }
  }
);

router.put(
  "/",
  requireAdmin,
  handleUpload,
  processImages(folderResolver),
  connectPageController.updateConnectPage
);

module.exports = router;
